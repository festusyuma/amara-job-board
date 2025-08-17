import { JobTable } from '@amara/db';
import { type MessagePayload, MessageType, ParsedJobPost } from '@amara/types';
import { Injectable } from '@nestjs/common';

import { ModelService } from '../util/model.service';

@Injectable()
export class JobService {
  constructor(private model: ModelService, private jobTable: JobTable) {}

  async parseJob(data: MessagePayload<typeof MessageType.JOB_POSTED>) {
    try {
      const parsedJob = await this.model.generateJson<ParsedJobPost>(
        this.getParseJobPrompt(data.name, data.description)
      );

      await this.jobTable.save(parsedJob);

      return parsedJob;
    } catch (error) {
      console.error('Error parsing job post:', error);
      throw new Error('Failed to parse job post.');
    }
  }

  private getParseJobPrompt(name: string, jobDescription: string) {
    return `
    You are an expert in parsing job descriptions. Your task is to extract skill information and format it as a JSON array of \`ParsedJobSkill\` objects.

    Here is the TypeScript definition for \`ParsedJobSkill\`:

    \`\`\`typescript
    type ParsedJobSkill = {
      name: string;
      /**
       * Level of importance compared to other skills [1-100]
       * 1 - can be overlooked
       * 100 - cannot proceed
       * */
      weight: number;
      /**
       * Minimum years of experience required
       * */
      yearsOfExperience: number;
    };


    type ParsedJobPost = {
      /**
       * Job title of position
       * */
      jobTitle: string;
      type: 'remote' | 'hybrid' | 'onsite'
      /**
       * Experience level required for job
       * */
      experienceLevel: 'manager' | 'senior' | 'mid' | 'junior' | 'intern'
      /**
       *  Skills required to have to be considered.
       *  the higher the weight, the higher the importance.
       * */
      requiredSkills: ParsedJobSkill[];
      /**
       *  Optional skills to boost candidates' chances.
       *  the higher the weight, the higher the boost.
       * */
      optionalSkills: ParsedJobSkill[];
      /**
       * Salary details
       * */
      salary: {
        currency: string;
        frequency: 'monthly' | 'hourly' | 'yearly' | 'bi-weekly';
        range: [
          /** Lower bound of salary */
          number,
          /** Upper bound of salary */
          number
        ];
      };
      educationRequired: {
        /** course of study */
        course: string
        /** Education level required */
        level: string;
        /** The higher the weight, the higher the boost */
        weight: number;
      }[];
    }
    \`\`\`

    **Instructions:**
    1.  Carefully read the provided job description.
    2.  Extract the \`jobTitle\`.
    3.  Identify \`requiredSkills\` and \`optionalSkills\`. For each skill, determine its \`name\`, \`weight\` (on a scale of 1-100, where 100 is critical/highly valued), and \`yearsOfExperience\` (minimum required). If weights or years are not explicit, make reasonable inferences.
    4.  Extract \`salary\` details: \`currency\`, \`frequency\` ('monthly', 'hourly', 'yearly', 'bi-weekly'), and \`range\` (an array of two numbers: [lower, upper]). If a single value is given for salary, use it for both lower and upper bounds. If salary is not mentioned, use default or empty values as appropriate for the structure.
    5.  Extract \`educationRequired\` details: \`level\` (e.g., 'Bachelor's Degree', 'Master's', 'High School Diploma') and \`weight\` (1-100).
    7.  Return ONLY the JSON object conforming to the \`ParsedJobPost\` structure. Do not include any additional text, markdown fences (like \`\`\`json), or formatting outside the JSON itself.

    **Job Name:** "${name}"
    **Job Description:**
    """
    ${jobDescription}
    """

    **Expected JSON Output Format (example - provide a complete valid JSON object):**
    \`\`\`json
    {
      "id": "your-job-id",
      "name": "Your Job Name",
      "description": "The full job description text...",
      "jobTitle": "Software Engineer",
      "requiredSkills": [
        {
          "name": "TypeScript",
          "weight": 90,
          "yearsOfExperience": 3
        },
        {
          "name": "Node.js",
          "weight": 85,
          "yearsOfExperience": 3
        }
      ],
      "optionalSkills": [
        {
          "name": "React",
          "weight": 60,
          "yearsOfExperience": 1
        }
      ],
      "salary": {
        "currency": "USD",
        "frequency": "yearly",
        "range": [100000, 150000]
      },
      "educationRequired": [
        {
          "level": "Bachelor's Degree",
          "weight": 80
        }
      ]
    }
    \`\`\`
    `;
  }
}

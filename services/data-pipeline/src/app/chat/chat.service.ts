import { JobTable } from '@amara/db';
import { ParsedJobPost } from '@amara/types';
import { Injectable } from '@nestjs/common';

import { ModelService } from '../util/model.service';

@Injectable()
export class ChatService {
  constructor(private model: ModelService, private jobDb: JobTable) {}

  async respond(data: { message: string; filePaths: string[] }) {
    const jobs = await this.jobDb.findAll();
    const message = await this.getChatPrompt(jobs, data.message);

    // let fileContents = '';
    //
    // for (const filePath of data.filePaths) {
    //   try {
    //     const fileData = await fetch.get_file_text_by_path({ pathInProject: filePath });
    //     if (fileData && fileData.get_file_text_by_path_response && fileData.get_file_text_by_path_response.response) {
    //       fileContents += `\n--- Content of ${filePath} ---\n`;
    //       fileContents += fileData.get_file_text_by_path_response.response;
    //       fileContents += '\n-----------------------------\n';
    //     } else {
    //       fileContents += `\n--- Could not read file: ${filePath} ---\n`;
    //     }
    //   } catch (_) {
    //     /* empty */
    //   }
    // }
    // todo push event

    return await this.model.generateText(message);
  }

  private async getChatPrompt(
    jobs: ParsedJobPost[],
    message: string,
    filePaths?: string[]
  ) {
    return `
You are an AI recruiter. Your goal is to provide a insight about jobs and perform professional assessment of a when needed.".

***Use these files for reference**
${filePaths?.join('\n')}

Below are the jobs listed.

    ${jobs
      .map(
        (job) => `
    **Job Details:**
Job Title: ${job.jobTitle}
Experience Level: ${job.experienceLevel}
Type: ${job.type}
Salary Range: ${job.salary.currency} ${job.salary.range[0]} - ${
          job.salary.range[1]
        } ${job.salary.frequency}
Required Skills:
${job.requiredSkills
  .map(
    (s) => `- ${s.name} (Weight: ${s.weight}, Years: ${s.yearsOfExperience}+)`
  )
  .join('\n')}
Optional Skills:
${job.optionalSkills
  .map(
    (s) => `- ${s.name} (Weight: ${s.weight}, Years: ${s.yearsOfExperience}+)`
  )
  .join('\n')}
Required Education:
${job.educationRequired
  .map((e) => `- ${e.level} in ${e.course} (Weight: ${e.weight})`)
  .join('\n')}
    `
      )
      .join('\n')}

Let the user know they have no jobs if there are no job details above.

**Output Format:**
Your response should be a professional recruiter's assistant, structured as follows. Do not include any code blocks or JSON.

${message}
    `;
  }
}

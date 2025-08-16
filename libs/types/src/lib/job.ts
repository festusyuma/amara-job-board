export type JobPost = {
  id: string;
  name: string;
  description: string;
  status: JobPostBoardSyncStatus;
};

export type ParsedJobSkill = {
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

/**
 * Should use the maximum years of experience in required skills
 * */
export type ParsedJobPost = {
  id: string;
  name: string;
  type: 'remote' | 'hybrid' | 'onsite'
  /**
   * Experience level required for job
   * */
  experienceLevel: 'manager' | 'senior' | 'mid' | 'junior' | 'intern'
  description: string;
  /**
   * Job title of position
   * */
  jobTitle: string;
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
};

export const JobPostBoardSyncStatus = {
  PENDING: 'PENDING',
  CREATED: 'CREATED',
  CREATE_FAILED: 'CREATED',
};

export type JobPostBoardSyncStatus =
  (typeof JobPostBoardSyncStatus)[keyof typeof JobPostBoardSyncStatus];

export type JobPostBoardSyncStatusUpdate = {
  id: string;
  status: JobPostBoardSyncStatus;
  board: string;
};

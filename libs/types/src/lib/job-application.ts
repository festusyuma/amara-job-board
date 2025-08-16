export type ParsedJobApplication = {
  talentId: string;
  jobId: string;
  /**
   * List of talent skills matched with the job
   * */
  skillsMatched: {
    name: string;
    /**
     * Similarity with ParsedJob weight.
     * calculated by level of experience and weight
     * of talent skill relative to the weight of
     * the job required/optional skill
     * */
    matchPercentage: number;
  }[];
  educationMatch: {
    course: string,
    level: string,
    matchPercentage: string
  },
  /**
   * Overall match percentage based on skills, education, location
   * */
  matchPercentage: number
};

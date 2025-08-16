export type ParsedTalent = {
  /**
   * Full name
   * */
  name: string;
  /**
   * State and country
   * */
  location: string;
  email: string;
  /**
   * LinkedIn, GitHub and others
   * */
  links: { name: string; url: string }[];
  /**
   * Current job title
   * */
  jobTitle: string;
  skills: {
    name: string;
    yearsOfExperience: number;
    /**
     * Calculated by years of experience relative to proficiency (1-100)
     * */
    score: number;
  }[];
  education: {
    /** course of study */
    course: string;
    /** Education level required */
    level: string;
  }[];
};

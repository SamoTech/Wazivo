export interface JobListing {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  applyLink: string;
  source: string;
  postedDate?: string;
  salary?: string;
  description?: string;
}

export interface SkillGap {
  category: string;
  gap: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CourseRecommendation {
  title: string;
  platform: string;
  duration: string;
  level: string;
  link: string;
  addressesGap: string;
  skills: string[];
  cost: string;
}

export interface AnalysisReport {
  candidateSummary: {
    name?: string;
    title?: string;
    experience?: string;
    keySkills: string[];
    location?: string;
  };
  jobOpportunities: JobListing[];
  weaknessesAndGaps: SkillGap[];
  recommendedCourses: CourseRecommendation[];
  marketInsights?: {
    demandLevel: string;
    avgSalaryRange?: string;
    trendingSkills: string[];
  };
}

export interface CVInput {
  type: 'file' | 'url';
  content: string | Buffer;
  filename?: string;
}

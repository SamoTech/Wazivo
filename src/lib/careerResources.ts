export type JobRegion = 'Egypt' | 'Gulf' | 'Remote';

export type JobSearchLink = {
  region: JobRegion;
  platform: string;
  label: string;
  url: string;
  query: string;
};

export type LearningLink = {
  title: string;
  provider: string;
  url: string;
};

export type MissingSkillResource = {
  skill: string;
  reason: string;
  freeCourses: LearningLink[];
  paidCourses: LearningLink[];
};

type PlatformDefinition = {
  name: string;
  buildUrl: (query: string) => string;
  regions: JobRegion[];
};

const REGION_QUERIES: Record<JobRegion, string> = {
  Egypt: 'Egypt Cairo Alexandria',
  Gulf: 'UAE Saudi Arabia Dubai Riyadh Doha Kuwait Bahrain Oman',
  Remote: 'Remote Worldwide',
};

function encode(value: string) {
  return encodeURIComponent(value);
}

function googleSiteSearch(domain: string, query: string) {
  return `https://www.google.com/search?q=${encode(`site:${domain} ${query}`)}`;
}

const JOB_PLATFORMS: PlatformDefinition[] = [
  {
    name: 'LinkedIn',
    buildUrl: (query) => `https://www.linkedin.com/jobs/search/?keywords=${encode(query)}`,
    regions: ['Egypt', 'Gulf', 'Remote'],
  },
  {
    name: 'Indeed',
    buildUrl: (query) => `https://www.indeed.com/jobs?q=${encode(query)}`,
    regions: ['Egypt', 'Remote'],
  },
  {
    name: 'Bayt',
    buildUrl: (query) => googleSiteSearch('bayt.com', query),
    regions: ['Egypt', 'Gulf'],
  },
  {
    name: 'Glassdoor',
    buildUrl: (query) => `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encode(query)}`,
    regions: ['Egypt', 'Remote'],
  },
  {
    name: 'Wuzzuf',
    buildUrl: (query) => `https://wuzzuf.net/search/jobs/?q=${encode(query)}`,
    regions: ['Egypt'],
  },
  {
    name: 'Naukrigulf',
    buildUrl: (query) => googleSiteSearch('naukrigulf.com', query),
    regions: ['Gulf'],
  },
  {
    name: 'GulfTalent',
    buildUrl: (query) => googleSiteSearch('gulftalent.com', query),
    regions: ['Gulf'],
  },
  {
    name: 'Monster Gulf',
    buildUrl: (query) => googleSiteSearch('monstergulf.com', query),
    regions: ['Gulf'],
  },
  {
    name: 'Wellfound',
    buildUrl: (query) => googleSiteSearch('wellfound.com/jobs', query),
    regions: ['Remote'],
  },
  {
    name: 'Remote OK',
    buildUrl: (query) => googleSiteSearch('remoteok.com', query),
    regions: ['Remote'],
  },
  {
    name: 'Remotive',
    buildUrl: (query) => googleSiteSearch('remotive.com/remote-jobs', query),
    regions: ['Remote'],
  },
];

const SKILL_REASONS: Record<string, string> = {
  SQL: 'Important for analytics, reporting, backend work, and data-aware product decisions.',
  TypeScript: 'Widely expected in modern frontend and full-stack engineering roles.',
  Cloud: 'Cloud fluency increases readiness for scalable production environments.',
  DevOps: 'DevOps skills help teams ship reliably and maintain healthy deployments.',
  APIs: 'API literacy is core for backend, full-stack, mobile, and integration-heavy roles.',
  Testing: 'Testing improves delivery quality and is often expected in mature engineering teams.',
  AI: 'AI and automation knowledge is increasingly valuable across technical and product roles.',
  Leadership: 'Leadership signals growth potential for senior, lead, and managerial tracks.',
  Communication: 'Clear communication improves interviews, teamwork, and stakeholder trust.',
  Product: 'Product thinking helps connect execution with user needs and business outcomes.',
  'Data Analysis': 'Data analysis strengthens decision-making and market relevance.',
};

function buildGenericFreeCourses(skill: string): LearningLink[] {
  return [
    {
      title: `${skill} with freeCodeCamp`,
      provider: 'freeCodeCamp',
      url: googleSiteSearch('freecodecamp.org', `${skill} course`),
    },
    {
      title: `${skill} tutorials on YouTube`,
      provider: 'YouTube',
      url: `https://www.youtube.com/results?search_query=${encode(`${skill} course`)}`,
    },
    {
      title: `${skill} learning roadmap`,
      provider: 'roadmap.sh',
      url: googleSiteSearch('roadmap.sh', `${skill} roadmap`),
    },
  ];
}

function buildGenericPaidCourses(skill: string): LearningLink[] {
  return [
    {
      title: `${skill} certificate paths`,
      provider: 'Coursera',
      url: `https://www.coursera.org/search?query=${encode(skill)}`,
    },
    {
      title: `${skill} practical courses`,
      provider: 'Udemy',
      url: `https://www.udemy.com/courses/search/?q=${encode(skill)}`,
    },
    {
      title: `${skill} professional learning`,
      provider: 'LinkedIn Learning',
      url: googleSiteSearch('linkedin.com/learning', `${skill} course`),
    },
  ];
}

export function inferRecommendedRoles(
  resumeText: string,
  skills: string[],
  careerLevel: string
): string[] {
  const owned = new Set(skills);
  const roles: string[] = [];

  if (owned.has('React') || owned.has('JavaScript') || owned.has('TypeScript')) {
    roles.push('Frontend Developer', 'Full Stack Developer');
  }

  if (owned.has('Python') || owned.has('SQL') || owned.has('APIs')) {
    roles.push('Backend Developer', 'Software Engineer');
  }

  if (owned.has('AI') || owned.has('Data Analysis')) {
    roles.push('AI Engineer', 'Data Analyst');
  }

  if (owned.has('Cloud') || owned.has('DevOps')) {
    roles.push('DevOps Engineer', 'Cloud Engineer', 'Platform Engineer');
  }

  if (owned.has('Product')) {
    roles.push('Product Manager', 'Technical Product Manager');
  }

  if (/support|operations|admin|network|infrastructure/i.test(resumeText)) {
    roles.push('Systems Engineer', 'IT Support Engineer');
  }

  if ((careerLevel === 'Lead' || careerLevel === 'Executive') && owned.has('Leadership')) {
    roles.push('Engineering Manager', 'Technical Lead');
  }

  if (!roles.length) {
    roles.push('Software Engineer', 'Full Stack Developer', 'Business Analyst');
  }

  return [...new Set(roles)].slice(0, 4);
}

function buildSearchQuery(role: string, skills: string[], careerLevel: string, region: JobRegion) {
  const level = careerLevel === 'Entry-level' ? '' : `${careerLevel} `;
  const skillText = skills.slice(0, 3).join(' ');
  return `${level}${role} ${skillText} ${REGION_QUERIES[region]}`.trim();
}

export function buildJobSearchLinks(
  roles: string[],
  skills: string[],
  careerLevel: string
): JobSearchLink[] {
  const primaryRole = roles[0] || 'Software Engineer';

  return (Object.keys(REGION_QUERIES) as JobRegion[]).flatMap((region) => {
    const query = buildSearchQuery(primaryRole, skills, careerLevel, region);

    return JOB_PLATFORMS.filter((platform) => platform.regions.includes(region)).map(
      (platform) => ({
        region,
        platform: platform.name,
        label: platform.name,
        query,
        url: platform.buildUrl(query),
      })
    );
  });
}

export function buildMissingSkillResources(skills: string[]): MissingSkillResource[] {
  return skills.map((skill) => ({
    skill,
    reason:
      SKILL_REASONS[skill] ||
      `${skill} appears under-emphasized for competitive Egypt, Gulf, and remote hiring markets.`,
    freeCourses: buildGenericFreeCourses(skill),
    paidCourses: buildGenericPaidCourses(skill),
  }));
}

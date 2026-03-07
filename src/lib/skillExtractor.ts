const SKILL_PATTERNS: Record<string, RegExp[]> = {
  JavaScript: [/\bjavascript\b/i, /\bnode\.js\b/i, /\bnodejs\b/i],
  TypeScript: [/\btypescript\b/i],
  React: [/\breact\b/i, /\bnext\.js\b/i, /\bnextjs\b/i],
  Python: [/\bpython\b/i, /\bdjango\b/i, /\bflask\b/i, /\bfastapi\b/i],
  SQL: [/\bsql\b/i, /\bpostgres\b/i, /\bmysql\b/i, /\bsqlite\b/i],
  NoSQL: [/\bmongodb\b/i, /\bredis\b/i, /\bfirestore\b/i],
  Cloud: [/\baws\b/i, /\bazure\b/i, /\bgcp\b/i, /\bgoogle cloud\b/i, /\bvercel\b/i],
  DevOps: [/\bdocker\b/i, /\bkubernetes\b/i, /\bterraform\b/i, /\bci\/cd\b/i, /\bgithub actions\b/i],
  APIs: [/\brest\b/i, /\bgraphql\b/i, /\bapi\b/i],
  'Data Analysis': [/\bpandas\b/i, /\bnumpy\b/i, /\bpower bi\b/i, /\btableau\b/i, /\bexcel\b/i],
  AI: [/\bllm\b/i, /\bgroq\b/i, /\bopenai\b/i, /\bhugging face\b/i, /\bmachine learning\b/i, /\bartificial intelligence\b/i],
  Testing: [/\bjest\b/i, /\bplaywright\b/i, /\bcypress\b/i, /\bunit test/i],
  Product: [/\broadmap\b/i, /\bstakeholder\b/i, /\bproduct management\b/i, /\buser research\b/i],
  Leadership: [/\bled\b/i, /\bmanaged\b/i, /\bmentored\b/i, /\bteam lead\b/i],
  Communication: [/\bpresented\b/i, /\bcollaborated\b/i, /\bclient\b/i, /\bcommunication\b/i],
};

const MARKET_BASELINE = [
  'SQL',
  'TypeScript',
  'Cloud',
  'DevOps',
  'APIs',
  'Testing',
  'AI',
  'Leadership',
  'Communication',
];

export function extractSkillsFromText(resumeText: string): string[] {
  const found = new Set<string>();

  for (const [skill, patterns] of Object.entries(SKILL_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(resumeText))) {
      found.add(skill);
    }
  }

  return [...found].sort((a, b) => a.localeCompare(b));
}

export function inferCareerLevel(resumeText: string): string {
  const normalized = resumeText.toLowerCase();
  const yearMatches = [...normalized.matchAll(/(\d{1,2})\+?\s+years?/g)].map((match) => Number(match[1]));
  const years = yearMatches.length ? Math.max(...yearMatches) : 0;

  if (/director|head of|vp|vice president|chief/i.test(resumeText)) return 'Executive';
  if (/lead|principal|staff engineer|engineering manager/i.test(resumeText) || years >= 8) return 'Lead';
  if (/senior|sr\.|architect/i.test(resumeText) || years >= 5) return 'Senior';
  if (years >= 2) return 'Mid-level';
  return 'Entry-level';
}

export function suggestMissingSkills(skills: string[], careerLevel: string): string[] {
  const owned = new Set(skills);
  const target = [...MARKET_BASELINE];

  if (careerLevel === 'Senior' || careerLevel === 'Lead' || careerLevel === 'Executive') {
    target.push('Product');
  }

  if (careerLevel === 'Lead' || careerLevel === 'Executive') {
    target.push('Leadership');
  }

  return [...new Set(target)]
    .filter((skill) => !owned.has(skill))
    .slice(0, 6);
}

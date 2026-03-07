type ScoreInput = {
  skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function calculateATSScore(resumeText: string, input: ScoreInput): number {
  const sectionChecks = [
    /summary|profile/i,
    /experience|employment/i,
    /skills/i,
    /education/i,
    /project/i,
  ];

  const presentSections = sectionChecks.filter((pattern) => pattern.test(resumeText)).length;
  const metricsCount = (resumeText.match(/\b\d+%|\b\d+\+|\$\d+/g) || []).length;
  const bulletCount = (resumeText.match(/^[\-•*]/gm) || []).length;
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);

  let score = 35;
  score += presentSections * 6;
  score += Math.min(input.skills.length, 8) * 3;
  score += Math.min(input.strengths.length, 4) * 2;
  score += Math.min(metricsCount, 5) * 3;
  score += Math.min(bulletCount, 8) * 1.5;
  score += hasEmail ? 4 : 0;
  score += hasLinkedIn ? 2 : 0;
  score -= Math.min(input.missing_skills.length, 6) * 2.5;
  score -= Math.min(input.weaknesses.length, 5) * 2;

  return Math.round(clamp(score, 0, 100));
}

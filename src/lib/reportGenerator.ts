import type { ResumeAnalysis } from './resumeAnalyzer';

export type ReportSection = {
  title: string;
  items: string[];
};

export function buildReportSections(analysis: ResumeAnalysis): ReportSection[] {
  return [
    {
      title: 'Strengths',
      items: analysis.strengths.length ? analysis.strengths : ['Solid baseline profile with clear career potential.'],
    },
    {
      title: 'Missing Skills',
      items: analysis.missing_skills.length ? analysis.missing_skills : ['No urgent market-skill gaps detected.'],
    },
    {
      title: 'Weaknesses',
      items: analysis.weaknesses.length ? analysis.weaknesses : ['No major structural weaknesses detected.'],
    },
    {
      title: 'Career Insights',
      items: [
        `Current career level: ${analysis.career_level}.`,
        `Resume score: ${analysis.score}/100.`,
        analysis.summary,
      ],
    },
  ];
}

export function buildReportMarkdown(analysis: ResumeAnalysis): string {
  const sections = buildReportSections(analysis)
    .map((section) => `## ${section.title}\n${section.items.map((item) => `- ${item}`).join('\n')}`)
    .join('\n\n');

  return `# Wazivo Report\n\n## Snapshot\n- Score: ${analysis.score}/100\n- Career level: ${analysis.career_level}\n- Skills: ${analysis.skills.join(', ') || 'N/A'}\n\n${sections}`;
}

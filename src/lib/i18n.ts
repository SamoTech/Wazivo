export const locales = ['en', 'ar'] as const;

export type Locale = (typeof locales)[number];

export function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isRTL(locale: Locale) {
  return locale === 'ar';
}

const dictionaries = {
  en: {
    languageName: 'English',
    languageSwitch: { current: 'Language', en: 'English', ar: 'العربية' },
    hero: {
      badge: 'AI career assistant for modern hiring',
      title: 'Turn any resume into a clear, ATS-ready hiring story.',
      description:
        'Wazivo analyzes resume quality, surfaces missing market skills, rewrites weak content, and helps candidates ship stronger applications without creating an account.',
      highlights: [
        'Structured AI resume scoring',
        'ATS rewrite generation',
        'Missing skill detection',
        'Cover letter creation',
      ],
      trustEyebrow: 'Why teams will trust it',
      trustTitle: 'Built like a real product MVP',
      trustItems: [
        'Typed APIs with safe JSON responses',
        'Groq-backed analysis with heuristic fallback',
        'Hash-based caching and anonymous rate limiting',
        'Responsive dashboard UI for analysis, rewrite, and cover letters',
      ],
    },
    upload: {
      eyebrow: 'Resume workspace',
      title: 'Analyze, rewrite, and tailor applications',
      description:
        'Paste a resume to generate a hiring-ready report. Add a job description to create a customized cover letter.',
      resumeLabel: 'Resume text',
      resumePaste: 'Paste CV',
      resumePlaceholder: 'Paste the full resume here...',
      resumeHint: 'Minimum 120 characters. Use Ctrl+V, long-press paste, or the Paste CV button.',
      jobLabel: 'Job description for cover letter',
      jobPaste: 'Paste JD',
      jobPlaceholder: 'Paste the target job description here...',
      analyze: 'Analyze resume',
      analyzing: 'Analyzing...',
      rewrite: 'Rewrite for ATS',
      rewriting: 'Rewriting...',
      coverLetter: 'Generate cover letter',
      generating: 'Generating...',
      emptyState:
        'Results will appear here after analysis. You will get a score, detected skills, missing skill gaps, smart job links, free-first learning suggestions, strengths, weaknesses, and a professional readiness report.',
      atsRewrite: 'ATS rewrite',
      plainText: 'Plain text',
      coverLetterTitle: 'Cover letter',
      generated: 'Generated',
      clipboardUnsupported: 'Clipboard paste is not supported in this browser.',
      clipboardEmpty: 'Clipboard is empty. Copy the CV first, then paste again.',
      clipboardFailed: 'Unable to access clipboard. Try Ctrl+V or long-press paste.',
      analyzeError: 'Unable to analyze resume.',
      rewriteError: 'Unable to rewrite resume.',
      coverError: 'Unable to generate cover letter.',
    },
    scoreCard: {
      score: 'Resume score',
      careerLevel: 'Career level',
    },
    jobs: {
      title: 'Find jobs',
      description:
        'Smart job-search links generated from your CV for Egypt, Gulf, and remote markets.',
      badge: 'Smart links',
      regionHint: 'Search using the strongest role detected from the CV.',
      empty: 'Job links will appear after the role and market query are generated.',
      regions: { Egypt: 'Egypt', Gulf: 'Gulf', Remote: 'Remote' },
    },
    missingSkills: {
      title: 'Missing market skills',
      description: 'Prioritized gaps with free learning paths first, then paid options.',
      badge: 'Priority gaps',
      free: 'Free courses first',
      paid: 'Paid options',
      empty: 'No major missing skills detected for the current profile.',
    },
    footer: {
      aboutTitle: 'Wazivo',
      aboutText:
        'AI-powered resume analysis and job matching platform. Get hired faster with intelligent career insights.',
      legal: 'Legal',
      resources: 'Resources',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
      github: 'GitHub',
      support: 'Support',
      reportIssue: 'Report Issue',
      rights: 'All rights reserved.',
    },
  },
  ar: {
    languageName: 'العربية',
    languageSwitch: { current: 'اللغة', en: 'English', ar: 'العربية' },
    hero: {
      badge: 'مساعد مهني ذكي للتوظيف الحديث',
      title: 'حوّل أي سيرة ذاتية إلى قصة توظيف واضحة وجاهزة لأنظمة ATS.',
      description:
        'يقوم Wazivo بتحليل جودة السيرة الذاتية، واكتشاف المهارات السوقية الناقصة، وإعادة صياغة المحتوى الضعيف، ومساعدة المرشح على تقديم طلب أقوى بدون إنشاء حساب.',
      highlights: [
        'تقييم ذكي منظم للسيرة الذاتية',
        'إعادة كتابة متوافقة مع ATS',
        'اكتشاف المهارات الناقصة',
        'إنشاء خطابات تقديم',
      ],
      trustEyebrow: 'لماذا يمكن الوثوق به',
      trustTitle: 'مبني كمنتج MVP حقيقي',
      trustItems: [
        'واجهات API typed مع استجابات JSON آمنة',
        'تحليل مدعوم بـ Groq مع fallback منطقي',
        'تخزين مؤقت معتمد على hash وحدود استخدام للمجهولين',
        'واجهة متجاوبة للتحليل وإعادة الكتابة وخطابات التقديم',
      ],
    },
    upload: {
      eyebrow: 'مساحة السيرة الذاتية',
      title: 'حلّل وعدّل وخصص طلبات التوظيف',
      description:
        'الصق السيرة الذاتية للحصول على تقرير جاهز للتوظيف. أضف وصف الوظيفة لإنشاء خطاب تقديم مخصص.',
      resumeLabel: 'نص السيرة الذاتية',
      resumePaste: 'الصق السيرة',
      resumePlaceholder: 'الصق السيرة الذاتية كاملة هنا...',
      resumeHint: 'الحد الأدنى 120 حرفًا. استخدم Ctrl+V أو الضغط المطول أو زر لصق السيرة.',
      jobLabel: 'وصف الوظيفة لخطاب التقديم',
      jobPaste: 'الصق الوصف',
      jobPlaceholder: 'الصق وصف الوظيفة المستهدفة هنا...',
      analyze: 'حلّل السيرة',
      analyzing: 'جارٍ التحليل...',
      rewrite: 'أعد الكتابة لـ ATS',
      rewriting: 'جارٍ إعادة الكتابة...',
      coverLetter: 'أنشئ خطاب تقديم',
      generating: 'جارٍ الإنشاء...',
      emptyState:
        'ستظهر النتائج هنا بعد التحليل. ستحصل على التقييم، والمهارات المكتشفة، والفجوات المهارية، وروابط وظائف ذكية، واقتراحات تعلم مجانية أولًا، ونقاط القوة والضعف، وتقرير جاهزية مهني.',
      atsRewrite: 'إعادة كتابة ATS',
      plainText: 'نص عادي',
      coverLetterTitle: 'خطاب التقديم',
      generated: 'تم الإنشاء',
      clipboardUnsupported: 'اللصق من الحافظة غير مدعوم في هذا المتصفح.',
      clipboardEmpty: 'الحافظة فارغة. انسخ السيرة أولًا ثم حاول مرة أخرى.',
      clipboardFailed: 'تعذر الوصول إلى الحافظة. جرّب Ctrl+V أو الضغط المطول.',
      analyzeError: 'تعذر تحليل السيرة الذاتية.',
      rewriteError: 'تعذر إعادة كتابة السيرة الذاتية.',
      coverError: 'تعذر إنشاء خطاب التقديم.',
    },
    scoreCard: {
      score: 'تقييم السيرة الذاتية',
      careerLevel: 'المستوى المهني',
    },
    jobs: {
      title: 'ابحث عن وظائف',
      description: 'روابط بحث ذكية مولدة من سيرتك الذاتية لأسواق مصر والخليج والعمل عن بُعد.',
      badge: 'روابط ذكية',
      regionHint: 'ابحث باستخدام أقوى مسمى وظيفي تم استخراجه من السيرة الذاتية.',
      empty: 'ستظهر روابط الوظائف بعد توليد الدور المناسب وسوق البحث.',
      regions: { Egypt: 'مصر', Gulf: 'الخليج', Remote: 'عن بُعد' },
    },
    missingSkills: {
      title: 'المهارات السوقية الناقصة',
      description: 'فجوات مرتبة حسب الأولوية مع مسارات تعلم مجانية أولًا ثم مدفوعة.',
      badge: 'فجوات مهمة',
      free: 'دورات مجانية أولًا',
      paid: 'خيارات مدفوعة',
      empty: 'لا توجد مهارات ناقصة رئيسية في الملف الحالي.',
    },
    footer: {
      aboutTitle: 'Wazivo',
      aboutText: 'منصة ذكية لتحليل السيرة الذاتية ومطابقة الوظائف ومساعدتك على التوظيف بشكل أسرع.',
      legal: 'قانوني',
      resources: 'الموارد',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
      contact: 'تواصل معنا',
      github: 'جيت هب',
      support: 'الدعم',
      reportIssue: 'الإبلاغ عن مشكلة',
      rights: 'جميع الحقوق محفوظة.',
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

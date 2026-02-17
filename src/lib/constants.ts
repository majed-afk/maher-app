// ===== Navigation Links =====
export const navLinks = {
  ar: [
    { label: "المميزات", href: "#features" },
    { label: "المواد", href: "#subjects" },
    { label: "الفئات العمرية", href: "#age-groups" },
    { label: "الأسعار", href: "#pricing" },
  ],
  en: [
    { label: "Features", href: "#features" },
    { label: "Subjects", href: "#subjects" },
    { label: "Age Groups", href: "#age-groups" },
    { label: "Pricing", href: "#pricing" },
  ],
};

// ===== Stats =====
export const stats = {
  ar: [
    { value: 50000, suffix: "+", label: "طفل يتعلم", icon: "users" },
    { value: 500, suffix: "+", label: "مدرسة شريكة", icon: "school" },
    { value: 10000, suffix: "+", label: "درس تفاعلي", icon: "book-open" },
    { value: 4.9, suffix: "★", label: "تقييم التطبيق", icon: "star", decimal: true },
  ],
  en: [
    { value: 50000, suffix: "+", label: "Kids Learning", icon: "users" },
    { value: 500, suffix: "+", label: "Partner Schools", icon: "school" },
    { value: 10000, suffix: "+", label: "Interactive Lessons", icon: "book-open" },
    { value: 4.9, suffix: "★", label: "App Rating", icon: "star", decimal: true },
  ],
};

// ===== Features =====
export const features = {
  ar: [
    {
      icon: "bot",
      title: "معلم ذكي شخصي",
      description: "ذكاء اصطناعي يتكيف مع مستوى طفلك ويقدم شرحًا مخصصًا لكل مفهوم",
      color: "purple",
    },
    {
      icon: "gamepad-2",
      title: "تعلّم باللعب",
      description: "نقاط ومكافآت وشارات تحفيزية تجعل التعلم مغامرة ممتعة لطفلك",
      color: "pink",
    },
    {
      icon: "book-heart",
      title: "محتوى إسلامي",
      description: "تحفيظ القرآن والأذكار وقصص الأنبياء بأسلوب تفاعلي محبب",
      color: "green",
    },
    {
      icon: "languages",
      title: "ثنائي اللغة",
      description: "محتوى متكامل بالعربية والإنجليزية لتنمية المهارات اللغوية",
      color: "blue",
    },
    {
      icon: "shield-check",
      title: "بيئة آمنة 100%",
      description: "بدون إعلانات، محتوى مراقب ومناسب لجميع الأعمار",
      color: "orange",
    },
    {
      icon: "chart-bar",
      title: "لوحة الأهل",
      description: "تتبع تقدم طفلك وتقارير أسبوعية مفصلة عن أدائه",
      color: "yellow",
    },
  ],
  en: [
    {
      icon: "bot",
      title: "Personal AI Tutor",
      description: "AI that adapts to your child's level and provides customized explanations",
      color: "purple",
    },
    {
      icon: "gamepad-2",
      title: "Learn by Playing",
      description: "Points, rewards, and badges that make learning a fun adventure",
      color: "pink",
    },
    {
      icon: "book-heart",
      title: "Islamic Content",
      description: "Quran memorization, Adhkar, and Prophet stories in an interactive way",
      color: "green",
    },
    {
      icon: "languages",
      title: "Bilingual",
      description: "Complete content in Arabic and English for language development",
      color: "blue",
    },
    {
      icon: "shield-check",
      title: "100% Safe Environment",
      description: "No ads, monitored and age-appropriate content",
      color: "orange",
    },
    {
      icon: "chart-bar",
      title: "Parent Dashboard",
      description: "Track your child's progress with detailed weekly reports",
      color: "yellow",
    },
  ],
};

// ===== Age Groups =====
export const ageGroups = {
  ar: [
    {
      name: "براعم",
      range: "3-6 سنوات",
      emoji: "🌱",
      color: "green",
      skills: ["الحروف العربية والإنجليزية", "الأرقام والعد", "الألوان والأشكال", "القصص المصورة", "الأناشيد التعليمية"],
    },
    {
      name: "نجوم",
      range: "6-9 سنوات",
      emoji: "⭐",
      color: "blue",
      skills: ["القراءة والكتابة", "الحساب الأساسي", "العلوم المبسطة", "تحفيظ القرآن", "اللغة الإنجليزية"],
    },
    {
      name: "أبطال",
      range: "9-12 سنة",
      emoji: "🏆",
      color: "purple",
      skills: ["المواد الدراسية المتقدمة", "التفكير النقدي", "حل المشكلات", "البرمجة الأساسية", "مهارات البحث"],
    },
  ],
  en: [
    {
      name: "Sprouts",
      range: "3-6 years",
      emoji: "🌱",
      color: "green",
      skills: ["Arabic & English Letters", "Numbers & Counting", "Colors & Shapes", "Picture Stories", "Educational Songs"],
    },
    {
      name: "Stars",
      range: "6-9 years",
      emoji: "⭐",
      color: "blue",
      skills: ["Reading & Writing", "Basic Math", "Simple Science", "Quran Memorization", "English Language"],
    },
    {
      name: "Champions",
      range: "9-12 years",
      emoji: "🏆",
      color: "purple",
      skills: ["Advanced Subjects", "Critical Thinking", "Problem Solving", "Basic Coding", "Research Skills"],
    },
  ],
};

// ===== Subjects =====
export const subjects = {
  ar: [
    { name: "القرآن الكريم", icon: "book-open", color: "#D4A843", bg: "#FFF8E7", description: "تحفيظ تفاعلي مع تجويد وتفسير مبسط" },
    { name: "اللغة العربية", icon: "pen-line", color: "#2ECC71", bg: "#F0FFF8", description: "حروف، قراءة، كتابة، نحو مبسط" },
    { name: "الرياضيات", icon: "calculator", color: "#3498DB", bg: "#F0F8FF", description: "أرقام، عمليات حسابية، أشكال هندسية" },
    { name: "العلوم", icon: "flask-conical", color: "#9B59B6", bg: "#F8F0FF", description: "تجارب، اكتشافات، عالم الطبيعة" },
    { name: "الإنجليزية", icon: "globe", color: "#E74C3C", bg: "#FFF0F0", description: "ABC، مفردات، محادثة، قراءة" },
    { name: "مهارات حياتية", icon: "lightbulb", color: "#F39C12", bg: "#FFF8F0", description: "تفكير، إبداع، تعاون، حل مشكلات" },
  ],
  en: [
    { name: "Holy Quran", icon: "book-open", color: "#D4A843", bg: "#FFF8E7", description: "Interactive memorization with Tajweed" },
    { name: "Arabic Language", icon: "pen-line", color: "#2ECC71", bg: "#F0FFF8", description: "Letters, reading, writing, grammar" },
    { name: "Mathematics", icon: "calculator", color: "#3498DB", bg: "#F0F8FF", description: "Numbers, operations, geometry" },
    { name: "Science", icon: "flask-conical", color: "#9B59B6", bg: "#F8F0FF", description: "Experiments, discoveries, nature" },
    { name: "English", icon: "globe", color: "#E74C3C", bg: "#FFF0F0", description: "ABC, vocabulary, conversation" },
    { name: "Life Skills", icon: "lightbulb", color: "#F39C12", bg: "#FFF8F0", description: "Thinking, creativity, collaboration" },
  ],
};

// ===== How It Works =====
export const howItWorks = {
  ar: [
    { step: 1, icon: "download", title: "حمّل التطبيق", description: "حمّل ماهر مجانًا من المتجر" },
    { step: 2, icon: "user-plus", title: "أنشئ ملف طفلك", description: "أدخل العمر والمستوى الدراسي" },
    { step: 3, icon: "wand-sparkles", title: "ماهر يختار المحتوى", description: "الذكاء الاصطناعي يحدد المسار المناسب" },
    { step: 4, icon: "rocket", title: "ابدأ رحلة التعلم!", description: "يتعلم طفلك بطريقة ممتعة وتفاعلية" },
  ],
  en: [
    { step: 1, icon: "download", title: "Download the App", description: "Download Maher for free from the store" },
    { step: 2, icon: "user-plus", title: "Create Child Profile", description: "Enter age and education level" },
    { step: 3, icon: "wand-sparkles", title: "Maher Picks Content", description: "AI determines the right learning path" },
    { step: 4, icon: "rocket", title: "Start Learning!", description: "Your child learns in a fun, interactive way" },
  ],
};

// ===== Testimonials =====
export const testimonials = {
  ar: [
    {
      name: "أم عبدالله",
      role: "أم لطفلين",
      avatar: "UA",
      rating: 5,
      text: "أطفالي أصبحوا يحبون وقت الدراسة! ماهر غيّر طريقة تعلمهم بالكامل.",
    },
    {
      name: "أبو سارة",
      role: "أب لثلاثة أطفال",
      avatar: "AS",
      rating: 5,
      text: "أفضل تطبيق تعليمي عربي. المحتوى الإسلامي ممتاز وأولادي يحفظون القرآن بسهولة.",
    },
    {
      name: "نورة المالكي",
      role: "معلمة ابتدائي",
      avatar: "NM",
      rating: 5,
      text: "أنصح كل أم وأب بهذا التطبيق. الذكاء الاصطناعي يفهم مستوى كل طفل ويتكيف معه.",
    },
    {
      name: "خالد العتيبي",
      role: "أب لطفل",
      avatar: "KA",
      rating: 5,
      text: "ابني تحسن في الرياضيات بشكل ملحوظ خلال شهر واحد فقط. شكرًا ماهر!",
    },
  ],
  en: [
    {
      name: "Umm Abdullah",
      role: "Mother of Two",
      avatar: "UA",
      rating: 5,
      text: "My kids love study time now! Maher completely changed how they learn.",
    },
    {
      name: "Abu Sarah",
      role: "Father of Three",
      avatar: "AS",
      rating: 5,
      text: "The best Arabic educational app. Islamic content is excellent and my kids memorize Quran easily.",
    },
    {
      name: "Noura Al-Malki",
      role: "Elementary Teacher",
      avatar: "NM",
      rating: 5,
      text: "I recommend this app to every parent. The AI understands each child's level and adapts.",
    },
    {
      name: "Khaled Al-Otaibi",
      role: "Father of One",
      avatar: "KA",
      rating: 5,
      text: "My son improved in math remarkably in just one month. Thank you Maher!",
    },
  ],
};

// ===== Pricing =====
export const pricing = {
  ar: [
    {
      name: "مجاني",
      price: "0",
      currency: "",
      period: "",
      color: "green",
      popular: false,
      features: [
        "3 دروس يوميًا",
        "مادتان فقط",
        "بطاقات تعليمية محدودة",
        "اختبارات أساسية",
      ],
      cta: "ابدأ مجانًا",
    },
    {
      name: "ماهر بلس",
      price: "29.99",
      currency: "ر.س",
      period: "/شهر",
      color: "purple",
      popular: true,
      features: [
        "دروس غير محدودة",
        "جميع المواد",
        "معلم AI شخصي",
        "تقارير أسبوعية",
        "بدون إعلانات",
        "طفل واحد",
      ],
      cta: "اشترك الآن",
    },
    {
      name: "ماهر عائلي",
      price: "49.99",
      currency: "ر.س",
      period: "/شهر",
      color: "orange",
      popular: false,
      features: [
        "كل مميزات بلس",
        "حتى 4 أطفال",
        "لوحة تحكم عائلية",
        "محتوى حصري",
        "أولوية الدعم الفني",
        "تقارير متقدمة",
      ],
      cta: "اشترك للعائلة",
    },
  ],
  en: [
    {
      name: "Free",
      price: "0",
      currency: "",
      period: "",
      color: "green",
      popular: false,
      features: [
        "3 Lessons per Day",
        "2 Subjects Only",
        "Limited Flashcards",
        "Basic Quizzes",
      ],
      cta: "Start Free",
    },
    {
      name: "Maher Plus",
      price: "7.99",
      currency: "$",
      period: "/mo",
      color: "purple",
      popular: true,
      features: [
        "Unlimited Lessons",
        "All Subjects",
        "Personal AI Tutor",
        "Weekly Reports",
        "Ad-Free",
        "1 Child",
      ],
      cta: "Subscribe Now",
    },
    {
      name: "Maher Family",
      price: "12.99",
      currency: "$",
      period: "/mo",
      color: "orange",
      popular: false,
      features: [
        "All Plus Features",
        "Up to 4 Children",
        "Family Dashboard",
        "Exclusive Content",
        "Priority Support",
        "Advanced Reports",
      ],
      cta: "Subscribe for Family",
    },
  ],
};

// ===== FAQ =====
export const faq = {
  ar: [
    {
      question: "ما هو تطبيق ماهر؟",
      answer: "ماهر هو منصة تعليمية ذكية للأطفال من 3 إلى 12 سنة، تستخدم الذكاء الاصطناعي لتقديم تجربة تعلم شخصية وممتعة تشمل القرآن الكريم، اللغة العربية، الرياضيات، العلوم، الإنجليزية، والمهارات الحياتية.",
    },
    {
      question: "هل التطبيق آمن لأطفالي؟",
      answer: "نعم، بيئة ماهر آمنة 100%. لا توجد إعلانات، المحتوى مراقب ومفلتر بالكامل، ولا يوجد تواصل مع غرباء. كل المحتوى مناسب للأعمار المستهدفة ومراجع من متخصصين.",
    },
    {
      question: "كيف يتكيف الذكاء الاصطناعي مع مستوى طفلي؟",
      answer: "يقوم ماهر بتحليل أداء طفلك في الاختبارات والأنشطة، ثم يعدّل صعوبة المحتوى تلقائيًا. إذا أتقن طفلك موضوعًا، ينتقل للأصعب. وإذا واجه صعوبة، يقدم شرحًا إضافيًا وتمارين مبسطة.",
    },
    {
      question: "هل يمكنني متابعة تقدم طفلي؟",
      answer: "بالتأكيد! لوحة الأهل تعرض تقارير مفصلة عن تقدم طفلك في كل مادة، الوقت المستغرق، نقاط القوة والضعف، مع تقرير أسبوعي يصلك على بريدك الإلكتروني.",
    },
    {
      question: "هل يمكنني استخدام حساب واحد لأكثر من طفل؟",
      answer: "في الخطة المجانية وماهر بلس، الحساب مخصص لطفل واحد. أما خطة ماهر عائلي فتتيح إضافة حتى 4 أطفال بملفات شخصية منفصلة ومسارات تعلم مستقلة.",
    },
    {
      question: "هل التطبيق يعمل بدون إنترنت؟",
      answer: "نعم، يمكنك تحميل الدروس مسبقًا للاستخدام بدون إنترنت. بعض الميزات مثل المعلم الذكي تحتاج اتصالاً بالإنترنت.",
    },
  ],
  en: [
    {
      question: "What is Maher?",
      answer: "Maher is a smart educational platform for children aged 3-12, using AI to provide a personalized and fun learning experience covering Holy Quran, Arabic, Math, Science, English, and Life Skills.",
    },
    {
      question: "Is the app safe for my children?",
      answer: "Yes, Maher is 100% safe. No ads, fully monitored and filtered content, and no contact with strangers. All content is age-appropriate and reviewed by specialists.",
    },
    {
      question: "How does the AI adapt to my child's level?",
      answer: "Maher analyzes your child's performance in tests and activities, then automatically adjusts content difficulty. If mastered, it moves to harder topics. If struggling, it provides extra explanation and simplified exercises.",
    },
    {
      question: "Can I track my child's progress?",
      answer: "Absolutely! The parent dashboard shows detailed reports on your child's progress in each subject, time spent, strengths and weaknesses, with a weekly report sent to your email.",
    },
    {
      question: "Can I use one account for multiple children?",
      answer: "On Free and Maher Plus plans, the account is for one child. Maher Family plan allows up to 4 children with separate profiles and independent learning paths.",
    },
    {
      question: "Does the app work offline?",
      answer: "Yes, you can download lessons in advance for offline use. Some features like the AI tutor require an internet connection.",
    },
  ],
};

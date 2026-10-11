/* ============================================================
   TypeArabic — Data layer
   Keyboard layout (standard Arabic 101), lessons, word banks.
   Loaded as a classic script so the app works from file:// too.
   ============================================================ */

/* Physical QWERTY rows, LTR, with the Arabic glyph each key produces.
   `finger` is used for the finger-colour legend:
   lp=left pinky, lr=left ring, lm=left middle, li=left index,
   ri=right index, rm=right middle, rr=right ring, rp=right pinky,
   th=thumb.                                                       */
const KEY_ROWS = [
  [
    { code: 'Backquote', en: '`', ar: 'ذ', finger: 'lp' },
    { code: 'Digit1', en: '1', ar: '١', finger: 'lp' },
    { code: 'Digit2', en: '2', ar: '٢', finger: 'lr' },
    { code: 'Digit3', en: '3', ar: '٣', finger: 'lm' },
    { code: 'Digit4', en: '4', ar: '٤', finger: 'li' },
    { code: 'Digit5', en: '5', ar: '٥', finger: 'li' },
    { code: 'Digit6', en: '6', ar: '٦', finger: 'ri' },
    { code: 'Digit7', en: '7', ar: '٧', finger: 'ri' },
    { code: 'Digit8', en: '8', ar: '٨', finger: 'rm' },
    { code: 'Digit9', en: '9', ar: '٩', finger: 'rr' },
    { code: 'Digit0', en: '0', ar: '٠', finger: 'rp' },
    { code: 'Minus', en: '-', ar: '-', finger: 'rp' },
    { code: 'Equal', en: '=', ar: '=', finger: 'rp' },
    { code: 'Backspace', en: 'Backspace', special: true, w: 2 },
  ],
  [
    { code: 'Tab', en: 'Tab', special: true, w: 1.5 },
    { code: 'KeyQ', en: 'q', ar: 'ض', finger: 'lp' },
    { code: 'KeyW', en: 'w', ar: 'ص', finger: 'lr' },
    { code: 'KeyE', en: 'e', ar: 'ث', finger: 'lm' },
    { code: 'KeyR', en: 'r', ar: 'ق', finger: 'li' },
    { code: 'KeyT', en: 't', ar: 'ف', finger: 'li' },
    { code: 'KeyY', en: 'y', ar: 'غ', finger: 'ri' },
    { code: 'KeyU', en: 'u', ar: 'ع', finger: 'ri' },
    { code: 'KeyI', en: 'i', ar: 'ه', finger: 'rm' },
    { code: 'KeyO', en: 'o', ar: 'خ', finger: 'rr' },
    { code: 'KeyP', en: 'p', ar: 'ح', finger: 'rp' },
    { code: 'BracketLeft', en: '[', ar: 'ج', finger: 'rp' },
    { code: 'BracketRight', en: ']', ar: 'د', finger: 'rp' },
    { code: 'Backslash', en: '\\', ar: '', finger: 'rp', w: 1.5 },
  ],
  [
    { code: 'CapsLock', en: 'Caps', special: true, w: 1.75 },
    { code: 'KeyA', en: 'a', ar: 'ش', finger: 'lp' },
    { code: 'KeyS', en: 's', ar: 'س', finger: 'lr' },
    { code: 'KeyD', en: 'd', ar: 'ي', finger: 'lm' },
    { code: 'KeyF', en: 'f', ar: 'ب', finger: 'li' },
    { code: 'KeyG', en: 'g', ar: 'ل', finger: 'li' },
    { code: 'KeyH', en: 'h', ar: 'ا', finger: 'ri' },
    { code: 'KeyJ', en: 'j', ar: 'ت', finger: 'ri' },
    { code: 'KeyK', en: 'k', ar: 'ن', finger: 'rm' },
    { code: 'KeyL', en: 'l', ar: 'م', finger: 'rr' },
    { code: 'Semicolon', en: ';', ar: 'ك', finger: 'rp' },
    { code: 'Quote', en: "'", ar: 'ط', finger: 'rp' },
    { code: 'Enter', en: 'Enter', special: true, w: 2.25 },
  ],
  [
    { code: 'ShiftLeft', en: 'Shift', special: true, w: 2.25 },
    { code: 'KeyZ', en: 'z', ar: 'ئ', finger: 'lp' },
    { code: 'KeyX', en: 'x', ar: 'ء', finger: 'lr' },
    { code: 'KeyC', en: 'c', ar: 'ؤ', finger: 'lm' },
    { code: 'KeyV', en: 'v', ar: 'ر', finger: 'li' },
    { code: 'KeyB', en: 'b', ar: 'لا', finger: 'li', ligature: true },
    { code: 'KeyN', en: 'n', ar: 'ى', finger: 'ri' },
    { code: 'KeyM', en: 'm', ar: 'ة', finger: 'ri' },
    { code: 'Comma', en: ',', ar: 'و', finger: 'rm' },
    { code: 'Period', en: '.', ar: 'ز', finger: 'rr' },
    { code: 'Slash', en: '/', ar: 'ظ', finger: 'rp' },
    { code: 'ShiftRight', en: 'Shift', special: true, w: 2.75 },
  ],
  [
    { code: 'Space', en: 'Space', ar: ' ', finger: 'th', w: 9, wide: true },
  ],
];

/* Build code<->char maps from the layout. The lam-alef key (KeyB)
   emits two code points, so it is shown but not auto-mapped. */
const CODE_TO_CHAR = {};
const CHAR_TO_KEY = {};
for (const row of KEY_ROWS) {
  for (const k of row) {
    if (k.special || !k.ar || k.ligature) continue;
    CODE_TO_CHAR[k.code] = k.ar;
    if (!(k.ar in CHAR_TO_KEY)) CHAR_TO_KEY[k.ar] = k.code;
  }
}

/* Treat the alef variants as the plain alef key for matching and hints. */
function normalizeChar(ch) {
  if (ch === 'أ' || ch === 'إ' || ch === 'آ' || ch === 'ٱ') return 'ا';
  return ch;
}

/* Word bank for drills. Alef variants are fine — they are normalised. */
const WORDS = [
  'من', 'إلى', 'على', 'في', 'هذا', 'هذه', 'أنا', 'أنت', 'نحن', 'هو', 'هي',
  'كان', 'ليس', 'ما', 'لا', 'نعم', 'بيت', 'باب', 'كتاب', 'قلم', 'ماء', 'خبز',
  'سوق', 'طريق', 'يوم', 'ليل', 'شمس', 'قمر', 'نجم', 'بحر', 'جبل', 'شجر',
  'زهر', 'طير', 'سمك', 'حليب', 'عسل', 'تفاح', 'موز', 'عنب', 'تين', 'تمر',
  'جمل', 'حصان', 'قطة', 'كلب', 'دجاجة', 'بقرة', 'خروف', 'مفتاح', 'صبر',
  'علم', 'قلب', 'عين', 'يد', 'رأس', 'وجه', 'سماء', 'أرض', 'نار', 'ريح',
  'مطر', 'ثلج', 'صيف', 'شتاء', 'ربيع', 'خريف', 'أخ', 'أخت', 'أب', 'أم',
  'جد', 'جدة', 'صديق', 'جار', 'مدينة', 'قرية', 'شارع', 'مدرسة', 'جامعة',
  'طالب', 'معلم', 'درس', 'سؤال', 'جواب', 'وقت', 'ساعة', 'دقيقة', 'سنة',
  'شهر', 'أسبوع', 'مال', 'عمل', 'نجاح', 'سلام', 'حرب', 'ملك', 'رئيس',
  'شعب', 'وطن', 'حب', 'أمل', 'فرح', 'حزن', 'ضحك',
];

const SHORT_WORDS = WORDS.filter((w) => w.length <= 4);
const LONG_WORDS = WORDS.filter((w) => w.length >= 5);

const TEXTS = [
  'العلم نور والجهل ظلام',
  'الكتاب خير جليس في الزمان',
  'من جد وجد ومن زرع حصد',
  'الصبر مفتاح الفرج',
  'الوقت كالسيف إن لم تقطعه قطعك',
  'اطلبوا العلم من المهد إلى اللحد',
  'خير الكلام ما قل ودل',
  'رب اشرح لي صدري ويسر لي أمري',
  'في التأني السلامة وفي العجلة الندامة',
  'لسانك حصانك إن صنته صانك',
  'الجار قبل الدار والرفيق قبل الطريق',
  'لا تؤجل عمل اليوم إلى الغد',
];

/* Arabic display fonts offered in the Font switcher. `stack` is the CSS
   font-family stack; Google-hosted families are loaded in index.html.
   KFGQPC Hafs ships only as a desktop font, so it works when installed
   locally (or via the custom-font uploader).                          */
const ARABIC_FONTS = [
  { id: 'noto-naskh', name: 'Noto Naskh Arabic', stack: "'Noto Naskh Arabic', 'Traditional Arabic', serif" },
  { id: 'noto-sans', name: 'Noto Sans Arabic', stack: "'Noto Sans Arabic', 'Segoe UI', sans-serif" },
  { id: 'cairo', name: 'Cairo', stack: "'Cairo', sans-serif" },
  { id: 'scheherazade', name: 'Scheherazade New', stack: "'Scheherazade New', serif" },
  { id: 'amiri', name: 'Amiri', stack: "'Amiri', serif" },
  { id: 'parastoo', name: 'Parastoo', stack: "'Parastoo', serif" },
  { id: 'lateef', name: 'Lateef', stack: "'Lateef', serif" },
  { id: 'aref', name: 'Aref Ruqaa', stack: "'Aref Ruqaa', serif" },
  { id: 'reem-kufi', name: 'Reem Kufi', stack: "'Reem Kufi', sans-serif" },
  { id: 'gulzar', name: 'Gulzar (Nastaliq)', stack: "'Gulzar', serif" },
  { id: 'kfgqpc', name: 'KFGQPC Hafs', stack: "'KFGQPC Hafs', 'KFGQPC Uthmanic Script HAFS', 'KFGQPC HAFS Uthmanic Script', serif" },
  { id: 'system', name: 'System default', stack: "'Segoe UI', Tahoma, 'Traditional Arabic', sans-serif" },
];

/* The course. `type` decides how a target string is generated. Each
   lesson carries English and Arabic labels so the UI language can
   switch without losing the progress bookkeeping by `id`.        */
const LESSONS = [
  { id: 'home-left', type: 'letters', chars: ['ش', 'س', 'ي', 'ب'],
    en: { title: 'Home Row — Left', sub: 'A S D F', level: 'beginner' },
    ar: { title: 'الصف الأوسط — اليسار', sub: 'A S D F', level: 'beginner' } },
  { id: 'home-right', type: 'letters', chars: ['ت', 'ن', 'م', 'ك'],
    en: { title: 'Home Row — Right', sub: 'J K L ;', level: 'beginner' },
    ar: { title: 'الصف الأوسط — اليمين', sub: 'J K L ;', level: 'beginner' } },
  { id: 'home-full', type: 'letters', chars: ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك'],
    en: { title: 'Home Row — Full', sub: 'All home-row keys', level: 'beginner' },
    ar: { title: 'الصف الأوسط كاملاً', sub: 'كل مفاتيح الصف الأوسط', level: 'beginner' } },
  { id: 'top-left', type: 'letters', chars: ['ض', 'ص', 'ث', 'ق', 'ف'],
    en: { title: 'Top Row — Left', sub: 'Q W E R T', level: 'basic' },
    ar: { title: 'الصف العلوي — اليسار', sub: 'Q W E R T', level: 'basic' } },
  { id: 'top-right', type: 'letters', chars: ['غ', 'ع', 'ه', 'خ', 'ح'],
    en: { title: 'Top Row — Right', sub: 'Y U I O P', level: 'basic' },
    ar: { title: 'الصف العلوي — اليمين', sub: 'Y U I O P', level: 'basic' } },
  { id: 'top-full', type: 'letters', chars: ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    en: { title: 'Top Row — Full', sub: 'All top-row keys', level: 'basic' },
    ar: { title: 'الصف العلوي كاملاً', sub: 'كل مفاتيح الصف العلوي', level: 'basic' } },
  { id: 'bottom', type: 'letters', chars: ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ'],
    en: { title: 'Bottom Row', sub: 'Z X C V …', level: 'intermediate' },
    ar: { title: 'الصف السفلي', sub: 'Z X C V …', level: 'intermediate' } },
  { id: 'all-letters', type: 'letters', chars: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
    en: { title: 'All Letters', sub: 'Full alphabet', level: 'intermediate' },
    ar: { title: 'كل الحروف', sub: 'الأبجدية كاملة', level: 'intermediate' } },
  { id: 'words-short', type: 'words', pool: 'short',
    en: { title: 'Short Words', sub: '2–4 letters', level: 'intermediate' },
    ar: { title: 'كلمات قصيرة', sub: 'حرفان إلى أربعة', level: 'intermediate' } },
  { id: 'words-common', type: 'words', pool: 'all',
    en: { title: 'Common Words', sub: 'Everyday vocabulary', level: 'advanced' },
    ar: { title: 'كلمات شائعة', sub: 'مفردات يومية', level: 'advanced' } },
  { id: 'words-long', type: 'words', pool: 'long',
    en: { title: 'Long Words', sub: '5+ letters', level: 'advanced' },
    ar: { title: 'كلمات طويلة', sub: 'خمسة أحرف وأكثر', level: 'advanced' } },
  { id: 'text-sentences', type: 'text',
    en: { title: 'Full Sentences', sub: 'Real prose', level: 'advanced' },
    ar: { title: 'جمل كاملة', sub: 'نصوص حقيقية', level: 'advanced' } },
];

/* Quran text is fetched from the public alquran.cloud API and cached in
   localStorage, so the library works offline after the first fetch.
   Drop a `quran-local.json` (same shape as the export) next to this app
   to seed the library without any network access.                    */
const QURAN_API = 'https://api.alquran.cloud/v1';
const QURAN_EDITION = 'quran-simple';

/* Expose for the app (classic scripts share the global scope). */
window.TA_DATA = {
  KEY_ROWS, CODE_TO_CHAR, CHAR_TO_KEY, normalizeChar,
  WORDS, SHORT_WORDS, LONG_WORDS, TEXTS, LESSONS, ARABIC_FONTS,
  QURAN_API, QURAN_EDITION,
};

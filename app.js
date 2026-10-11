/* ============================================================
   TypeArabic — application logic
   ============================================================ */
(function () {
  'use strict';

  const {
    KEY_ROWS, CODE_TO_CHAR, CHAR_TO_KEY, normalizeChar,
    WORDS, SHORT_WORDS, LONG_WORDS, TEXTS, LESSONS, ARABIC_FONTS,
    QURAN_API, QURAN_EDITION,
  } = window.TA_DATA;

  /* ---------- tiny helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const fmtTime = (sec) => {
    sec = Math.max(0, Math.round(sec));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  };
  const cssVar = (name) => (getComputedStyle(document.documentElement).getPropertyValue(name) || '').trim();

  const segmenter = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? new Intl.Segmenter('ar', { granularity: 'grapheme' })
    : null;
  const splitGraphemes = (str) => segmenter
    ? Array.from(segmenter.segment(str), (s) => s.segment)
    : Array.from(str);

  /* ============================================================
     Localisation — English is the default UI language
     ============================================================ */
  const I18N = {
    en: {
      'app.title': 'TypeArabic — Learn Arabic Typing',
      'brand.tagline': 'Learn Arabic typing',
      'tab.practice': 'Practice',
      'tab.quran': 'Quran',
      'tab.focus': 'Mistake Focus',
      'tab.progress': 'My Progress',
      'tool.sound': 'Sound',
      'tool.theme': 'Theme',
      'tool.help': 'Help',
      'tool.lang': 'Switch language',
      'mode.lesson': 'Lesson',
      'mode.time': 'Time',
      'mode.words': 'Words',
      'mode.title.time': 'Time {n}s',
      'mode.title.words': 'Words {n}',
      'mode.sub.time': 'Type as many words as you can',
      'mode.sub.words': 'Fixed number of words',
      'mode.lessonHint': 'Choose a lesson, or switch to Time / Words',
      'opt.font': 'Font',
      'font.upload': 'Upload custom font…',
      'stat.wpm': 'WPM',
      'stat.acc': 'Accuracy',
      'stat.errors': 'Errors',
      'stat.streak': 'Streak',
      'stat.time': 'Time',
      'stat.bestWpm': 'Best WPM',
      'stat.bestAcc': 'Best accuracy',
      'stat.sessions': 'Sessions',
      'stat.dayStreak': 'Day streak',
      'stat.lessonsDone': 'Lessons done',
      'btn.restart': '↻ Restart',
      'btn.newdrill': '✦ New drill',
      'btn.next': 'Next →',
      'btn.retry': '↻ Again',
      'btn.mistakeDrill': '◎ Mistake drill',
      'btn.nextLesson': 'Next lesson →',
      'opt.keyboard': 'Keyboard',
      'opt.stoperror': 'Stop on error',
      'opt.stoperrorTitle': 'Correct a mistake before moving on',
      'hint.start': 'Start typing — no need to switch your system language',
      'focus.title': 'Mistake Focus',
      'focus.lead': 'The app tracks every letter you get wrong, then builds a custom drill around the letters that trip you up most. Weak spots become strengths.',
      'focus.start': '◎ Start mistake drill',
      'focus.chars': 'Your difficult letters',
      'focus.charsHint': 'Click a letter to drill it on its own',
      'focus.conf': 'Most common mix-ups',
      'focus.confHint': 'you typed ⟶ correct',
      'focus.summary': 'Mistakes summary',
      'focus.reset': 'Reset mistake stats',
      'focus.empty': 'No mistakes recorded yet — nice! Start practising and results will appear here.',
      'focus.noChars': 'No difficult letters yet.',
      'focus.noConf': 'No mix-ups recorded yet.',
      'focus.times': '{n}×',
      'focus.errAcc': '{e} errors · {a}% accuracy',
      'progress.heat': 'Letter heatmap',
      'progress.heatHint': "each key's colour shows your accuracy",
      'progress.best': 'best',
      'progress.worst': 'worst',
      'progress.lessons': 'Lessons',
      'progress.reset': 'Reset all progress',
      'progress.bestScore': 'best: {w} WPM · {a}%',
      'progress.keyStat': '{ch} — {a}% accuracy · {e} errors',
      'progress.noData': '{ch} — no data',
      'result.done': 'Test complete!',
      'result.sDone': 'Nice work — keep it up.',
      'result.tPerfect': 'Amazing! 🏆',
      'result.sPerfect': 'High accuracy and great speed.',
      'result.tGreat': 'Excellent! 🌟',
      'result.sGreat': 'Your accuracy is excellent — now build speed.',
      'result.tLow': 'Keep practising',
      'result.sLow': 'Focus on accuracy before speed.',
      'result.wpm': 'WPM',
      'result.raw': 'Raw WPM',
      'result.accuracy': 'Accuracy',
      'result.consistency': 'Consistency',
      'result.correct': 'Correct',
      'result.incorrect': 'Incorrect',
      'result.missed': 'Missed',
      'result.extra': 'Extra',
      'result.mistakesTitle': 'Letters to focus on',
      'toast.newDrill': 'New drill generated',
      'toast.mistakesReset': 'Mistake stats cleared',
      'toast.allReset': 'All progress cleared',
      'toast.fontLoaded': 'Custom font loaded',
      'toast.fontFailed': 'Could not load that font',
      'toast.restart': 'Restarted — start typing',
      'confirm.reset': 'Reset all progress and stats?',
      'level.beginner': 'Beginner',
      'level.basic': 'Basic',
      'level.intermediate': 'Intermediate',
      'level.advanced': 'Advanced',
      'level.focus': 'Focus',
      'level.time': 'Time',
      'level.words': 'Words',
      'level.quran': 'Quran',
      'quran.title': 'Quran library',
      'quran.lead': 'Practice typing real Quranic text. Pick a surah and an ayah range; the text is fetched from the alquran.cloud API and saved on your device so the library keeps working offline.',
      'quran.search': 'Search surah name or number…',
      'quran.downloadAll': 'Download all (offline)',
      'quran.export': 'Export',
      'quran.import': 'Import',
      'quran.clear': 'Clear offline cache',
      'quran.loadingList': 'Loading surah list…',
      'quran.loading': 'Loading…',
      'quran.errorList': 'Could not reach the Quran API. Check your connection or import a local file.',
      'quran.offlineList': 'Offline — showing cached surahs.',
      'quran.status': '{n} surahs · {c} saved offline',
      'quran.pickSurah': 'Select a surah to begin.',
      'quran.notCached': 'This surah is not saved offline and the API could not be reached.',
      'quran.from': 'From',
      'quran.to': 'To',
      'quran.first10': 'First 10',
      'quran.whole': 'Whole surah',
      'quran.random': 'Random ayah',
      'quran.harakat': 'Show harakat (harder)',
      'quran.start': '▶ Start typing',
      'quran.saveOffline': 'Save offline',
      'quran.downloading': 'Downloading… {done}/{total}',
      'quran.downloaded': 'Saved {n} surahs offline.',
      'quran.savedOffline': 'Surah saved offline.',
      'quran.saveFailed': 'Could not save that surah.',
      'quran.imported': 'Quran data imported.',
      'quran.importFailed': 'Could not read that file.',
      'quran.cleared': 'Offline cache cleared.',
      'quran.ayahs': '{n} ayahs',
      'quran.meccan': 'Meccan',
      'quran.medinan': 'Medinan',
      'quran.offlineDot': 'Available offline',
      'quran.noMatch': 'No surahs match your search.',
      'finger.lp': 'Left pinky', 'finger.lr': 'Left ring', 'finger.lm': 'Left middle',
      'finger.li': 'Left index', 'finger.ri': 'Right index', 'finger.rm': 'Right middle',
      'finger.rr': 'Right ring', 'finger.rp': 'Right pinky', 'finger.th': 'Thumb',
      'drill.charTitle': 'Letter “{ch}” drill',
      'drill.charSub': 'Targeted practice',
      'drill.mistakeTitle': 'Mistake drill',
      'drill.mistakeSub': 'Your hardest letters',
      'drill.general': 'General practice',
      'help.title': 'How to use it',
      'help.1': 'Pick a lesson or press “Next”. The key you need lights up on the keyboard.',
      'help.2': 'Type the highlighted letter. Correct letters turn bright; a wrong key flashes red.',
      'help.3': 'You do not need to change your computer language — the app maps your physical keys to Arabic letters.',
      'help.4': 'Every mistake is recorded. Open the Mistake Focus tab to generate a drill built from your own weak letters.',
      'help.5': 'Follow your progress in the My Progress tab with the per-letter accuracy heatmap.',
      'help.6': 'Switch between Lesson, Time and Words at the top. In Time mode the clock starts on your first keystroke.',
      'help.7': 'Press Tab while typing to instantly restart the current test. Change the Arabic font from the Font menu.',
      'help.note': 'Tip: keep your fingers on the home row and use the correct finger for each key.',
    },
    ar: {
      'app.title': 'TypeArabic — تعلّم الطباعة بالعربية',
      'brand.tagline': 'تعلّم الطباعة بالعربية',
      'tab.practice': 'تدريب',
      'tab.quran': 'القرآن',
      'tab.focus': 'تركيز الأخطاء',
      'tab.progress': 'تقدمي',
      'tool.sound': 'الصوت',
      'tool.theme': 'المظهر',
      'tool.help': 'مساعدة',
      'tool.lang': 'تبديل اللغة',
      'mode.lesson': 'درس',
      'mode.time': 'زمن',
      'mode.words': 'كلمات',
      'mode.title.time': 'زمن {n} ثانية',
      'mode.title.words': '{n} كلمة',
      'mode.sub.time': 'اكتب أكبر عدد ممكن من الكلمات',
      'mode.sub.words': 'عدد ثابت من الكلمات',
      'mode.lessonHint': 'اختر درساً، أو بدّل إلى الزمن / الكلمات',
      'opt.font': 'الخط',
      'font.upload': 'رفع خط مخصّص…',
      'stat.wpm': 'كلمة/دقيقة',
      'stat.acc': 'الدقة',
      'stat.errors': 'الأخطاء',
      'stat.streak': 'تسلسل صحيح',
      'stat.time': 'الوقت',
      'stat.bestWpm': 'أفضل سرعة',
      'stat.bestAcc': 'أفضل دقة',
      'stat.sessions': 'جلسات مكتملة',
      'stat.dayStreak': 'أيام متتابعة',
      'stat.lessonsDone': 'دروس مكتملة',
      'btn.restart': '↻ إعادة',
      'btn.newdrill': '✦ درس جديد',
      'btn.next': 'التالي ←',
      'btn.retry': '↻ مرة أخرى',
      'btn.mistakeDrill': '◎ تدريب الأخطاء',
      'btn.nextLesson': 'الدرس التالي ←',
      'opt.keyboard': 'لوحة المفاتيح',
      'opt.stoperror': 'إيقاف عند الخطأ',
      'opt.stoperrorTitle': 'يجب تصحيح الخطأ قبل المتابعة',
      'hint.start': 'ابدأ الكتابة — لا حاجة لتغيير لغة النظام',
      'focus.title': 'وضع التركيز على الأخطاء',
      'focus.lead': 'يتتبّع التطبيق كل حرف تُخطئ فيه، ثم يبني تدريباً مخصّصاً حول الحروف التي تُصعِّب عليك أكثر. هكذا تتحوّل نقاط ضعفك إلى قوة.',
      'focus.start': '◎ ابدأ تدريب الأخطاء',
      'focus.chars': 'حروفك الصعبة',
      'focus.charsHint': 'اضغط على حرف لتدريبه وحده',
      'focus.conf': 'أكثر حالات الالتباس',
      'focus.confHint': 'كتبت ⟶ والصحيح',
      'focus.summary': 'ملخص الأخطاء',
      'focus.reset': 'تصفير إحصاءات الأخطاء',
      'focus.empty': 'لا توجد أخطاء مسجّلة بعد — أحسنت! ابدأ التدريب وستظهر النتائج هنا.',
      'focus.noChars': 'لا توجد حروف صعبة بعد.',
      'focus.noConf': 'لا توجد حالات التباس بعد.',
      'focus.times': '{n} مرة',
      'focus.errAcc': '{e} خطأ · دقة {a}%',
      'progress.heat': 'خريطة الحروف',
      'progress.heatHint': 'لون كل مفتاح يدل على دقتك فيه',
      'progress.best': 'الأفضل',
      'progress.worst': 'الأضعف',
      'progress.lessons': 'الدروس',
      'progress.reset': 'تصفير كل التقدم',
      'progress.bestScore': 'الأفضل: {w} كلمة/د · {a}%',
      'progress.keyStat': '{ch} — دقة {a}% · {e} خطأ',
      'progress.noData': '{ch} — لا بيانات',
      'result.done': 'اكتمل الاختبار!',
      'result.sDone': 'أحسنت، واصل التقدّم.',
      'result.tPerfect': 'مذهل! 🏆',
      'result.sPerfect': 'دقة عالية وسرعة رائعة.',
      'result.tGreat': 'ممتاز! 🌟',
      'result.sGreat': 'دقتك ممتازة — اعمل الآن على السرعة.',
      'result.tLow': 'تحتاج مزيداً من التدريب',
      'result.sLow': 'ركّز على الدقة قبل السرعة.',
      'result.wpm': 'كلمة/دقيقة',
      'result.raw': 'السرعة الخام',
      'result.accuracy': 'الدقة',
      'result.consistency': 'الثبات',
      'result.correct': 'صحيح',
      'result.incorrect': 'خطأ',
      'result.missed': 'فائت',
      'result.extra': 'زائد',
      'result.mistakesTitle': 'حروف تحتاج تركيزاً',
      'toast.newDrill': 'تم توليد تدريب جديد',
      'toast.mistakesReset': 'تم تصفير إحصاءات الأخطاء',
      'toast.allReset': 'تم تصفير كل التقدم',
      'toast.fontLoaded': 'تم تحميل الخط المخصّص',
      'toast.fontFailed': 'تعذّر تحميل ذلك الخط',
      'toast.restart': 'أُعيد الاختبار — ابدأ الكتابة',
      'confirm.reset': 'هل تريد تصفير كل التقدم والإحصاءات؟',
      'level.beginner': 'مبتدئ',
      'level.basic': 'أساسي',
      'level.intermediate': 'متوسط',
      'level.advanced': 'متقدم',
      'level.focus': 'تركيز',
      'level.time': 'زمن',
      'level.words': 'كلمات',
      'level.quran': 'القرآن',
      'quran.title': 'مكتبة القرآن',
      'quran.lead': 'تدرّب على كتابة نصٍّ قرآني حقيقي. اختر سورة ونطاق آيات؛ يُجلب النص من واجهة alquran.cloud ويُحفظ على جهازك ليعمل دون إنترنت.',
      'quran.search': 'ابحث باسم السورة أو رقمها…',
      'quran.downloadAll': 'تنزيل الكل (دون إنترنت)',
      'quran.export': 'تصدير',
      'quran.import': 'استيراد',
      'quran.clear': 'مسح الذاكرة المؤقتة',
      'quran.loadingList': 'جارٍ تحميل قائمة السور…',
      'quran.loading': 'جارٍ التحميل…',
      'quran.errorList': 'تعذّر الوصول إلى واجهة القرآن. تحقق من اتصالك أو استورد ملفاً محلياً.',
      'quran.offlineList': 'دون إنترنت — تُعرض السور المحفوظة.',
      'quran.status': '{n} سورة · {c} محفوظة دون إنترنت',
      'quran.pickSurah': 'اختر سورة للبدء.',
      'quran.notCached': 'هذه السورة غير محفوظة دون إنترنت وتعذّر الوصول إلى الواجهة.',
      'quran.from': 'من',
      'quran.to': 'إلى',
      'quran.first10': 'أول ١٠',
      'quran.whole': 'السورة كاملة',
      'quran.random': 'آية عشوائية',
      'quran.harakat': 'إظهار التشكيل (أصعب)',
      'quran.start': '▶ ابدأ الكتابة',
      'quran.saveOffline': 'حفظ دون إنترنت',
      'quran.downloading': 'يُنزَّل… {done}/{total}',
      'quran.downloaded': 'تم حفظ {n} سورة دون إنترنت.',
      'quran.savedOffline': 'تم حفظ السورة دون إنترنت.',
      'quran.saveFailed': 'تعذّر حفظ تلك السورة.',
      'quran.imported': 'تم استيراد بيانات القرآن.',
      'quran.importFailed': 'تعذّر قراءة ذلك الملف.',
      'quran.cleared': 'تم مسح الذاكرة المؤقتة.',
      'quran.ayahs': '{n} آية',
      'quran.meccan': 'مكية',
      'quran.medinan': 'مدنية',
      'quran.offlineDot': 'متاحة دون إنترنت',
      'quran.noMatch': 'لا توجد سور مطابقة لبحثك.',
      'finger.lp': 'الخنصر الأيسر', 'finger.lr': 'البنصر الأيسر', 'finger.lm': 'الوسطى اليسرى',
      'finger.li': 'السبابة اليسرى', 'finger.ri': 'السبابة اليمنى', 'finger.rm': 'الوسطى اليمنى',
      'finger.rr': 'البنصر الأيمن', 'finger.rp': 'الخنصر الأيمن', 'finger.th': 'الإبهام',
      'drill.charTitle': 'تدريب حرف «{ch}»',
      'drill.charSub': 'تدريب مخصّص',
      'drill.mistakeTitle': 'تدريب الأخطاء',
      'drill.mistakeSub': 'أصعب حروفك',
      'drill.general': 'تدريب عام',
      'help.title': 'كيف تستخدم التطبيق؟',
      'help.1': 'اختر درساً أو اضغط «التالي». يضيء المفتاح المطلوب على لوحة المفاتيح.',
      'help.2': 'اكتب الحرف المُظلَّل. الحروف الصحيحة تُشرق، والخطأ يومض بالأحمر.',
      'help.3': 'لا تحتاج إلى تغيير لغة الكمبيوتر — يربط التطبيق مفاتيحك الفعلية بالحروف العربية.',
      'help.4': 'كل خطأ يُسجَّل. افتح تبويب «تركيز الأخطاء» ليتولّد تدريب من حروفك الصعبة.',
      'help.5': 'تابع تقدّمك في تبويب «تقدمي» عبر خريطة دقة الحروف.',
      'help.6': 'بدّل بين الدرس والزمن والكلمات من الأعلى. في وضع الزمن تبدأ الساعة عند أول ضغطة.',
      'help.7': 'اضغط Tab أثناء الكتابة لإعادة الاختبار فوراً. غيّر خط العرض من قائمة «الخط».',
      'help.note': 'نصيحة: حافظ على أصابعك على الصف الأوسط واستخدم الإصبع الصحيح لكل مفتاح.',
    },
  };

  /* ============================================================
     Persistent progress store
     ============================================================ */
  const STORE_KEY = 'typearabic.v1';

  function defaultProgress() {
    return {
      byChar: {},
      lessons: {},
      bestWpm: 0,
      bestAcc: 0,
      sessions: 0,
      totalKeystrokes: 0,
      totalCorrect: 0,
      dayStreak: 0,
      lastDay: null,
      settings: {
        sound: true, showKeyboard: true, stopOnError: true, theme: 'dark', lang: 'en',
        font: 'noto-naskh', customFont: null, mode: 'lesson', time: 30, words: 25,
        quranHarakat: false,
      },
    };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultProgress();
      const parsed = JSON.parse(raw);
      const p = defaultProgress();
      return {
        ...p, ...parsed,
        byChar: parsed.byChar || {},
        lessons: parsed.lessons || {},
        settings: { ...p.settings, ...(parsed.settings || {}) },
      };
    } catch (e) {
      return defaultProgress();
    }
  }

  const progress = loadProgress();
  let saveTimer = null;
  function save() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
    }, 350);
  }
  function saveNow() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }

  const settings = progress.settings;
  let lang = settings.lang === 'ar' ? 'ar' : 'en';

  function translate(l, key, vars) {
    const s = (I18N[l] && I18N[l][key]) || I18N.en[key] || key;
    return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m)) : s;
  }
  const t = (key, vars) => translate(lang, key, vars);

  /* ============================================================
     Sound
     ============================================================ */
  let audioCtx = null;
  function beep(freq, dur, type = 'sine', gain = 0.05) {
    if (!settings.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g); g.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      o.start(now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.stop(now + dur);
    } catch (e) { /* ignore */ }
  }

  /* ============================================================
     Toast
     ============================================================ */
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  /* ============================================================
     Keyboard rendering
     ============================================================ */
  function buildKeyboard(root) {
    root.innerHTML = '';
    const keyEls = {};
    for (const row of KEY_ROWS) {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';
      for (const k of row) {
        const el = document.createElement('div');
        el.className = 'key';
        el.style.setProperty('--fw', k.w || 1);
        if (k.special) el.classList.add('special');
        if (k.finger) el.classList.add('f-' + k.finger);
        if (k.code === 'KeyF' || k.code === 'KeyJ') el.classList.add('home-key');
        el.dataset.code = k.code;

        const ar = document.createElement('span');
        ar.className = 'k-ar';
        ar.textContent = k.special ? k.en : (k.ar || '');
        el.appendChild(ar);
        if (!k.special && k.en !== undefined) {
          const en = document.createElement('span');
          en.className = 'k-en';
          en.textContent = k.en;
          el.appendChild(en);
        }
        if (k.finger && !k.special) {
          const dot = document.createElement('i');
          dot.className = 'k-dot';
          el.appendChild(dot);
        }
        keyEls[k.code] = el;
        rowEl.appendChild(el);
      }
      root.appendChild(rowEl);
    }
    return keyEls;
  }

  function buildLegend() {
    const wrap = $('#finger-legend');
    wrap.innerHTML = '';
    const seen = new Set();
    for (const row of KEY_ROWS) for (const k of row) {
      if (!k.finger || k.special || seen.has(k.finger)) continue;
      seen.add(k.finger);
      const item = document.createElement('span');
      item.className = 'legend-item';
      const dot = document.createElement('i');
      dot.style.background = `var(--f-${k.finger})`;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(t('finger.' + k.finger)));
      wrap.appendChild(item);
    }
  }

  /* ============================================================
     Fonts
     ============================================================ */
  function populateFonts() {
    const sel = $('#opt-font');
    sel.innerHTML = '';
    for (const f of ARABIC_FONTS) {
      const o = document.createElement('option');
      o.value = f.id; o.textContent = f.name;
      sel.appendChild(o);
    }
    const custom = document.createElement('option');
    custom.value = '__custom'; custom.textContent = t('font.upload');
    sel.appendChild(custom);
    sel.value = settings.font || 'noto-naskh';
  }

  function applyFont() {
    let stack;
    if (settings.font === '__custom' && settings.customFont && settings.customFont.family) {
      stack = `'${settings.customFont.family}', var(--font-ar)`;
    } else {
      const f = ARABIC_FONTS.find((x) => x.id === settings.font);
      stack = f ? f.stack : ARABIC_FONTS[0].stack;
    }
    document.documentElement.style.setProperty('--font-display', stack);
  }

  async function registerCustomFont(family, dataUrl) {
    try {
      const ff = new FontFace(family, `url(${dataUrl})`);
      await ff.load();
      document.fonts.add(ff);
      return true;
    } catch (e) { return false; }
  }

  const fontFile = document.createElement('input');
  fontFile.type = 'file';
  fontFile.accept = '.ttf,.otf,.woff,.woff2,font/*';
  fontFile.hidden = true;
  document.body.appendChild(fontFile);

  fontFile.addEventListener('change', () => {
    const file = fontFile.files && fontFile.files[0];
    if (!file) { populateFonts(); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result);
      const family = 'CustomArabic_' + Date.now();
      const ok = await registerCustomFont(family, dataUrl);
      if (!ok) { toast(t('toast.fontFailed')); populateFonts(); return; }
      settings.font = '__custom';
      settings.customFont = { family, data: dataUrl };
      applyFont();
      populateFonts();
      save();
      toast(t('toast.fontLoaded'));
    };
    reader.readAsDataURL(file);
    fontFile.value = '';
  });

  /* ============================================================
     Content generation
     ============================================================ */
  function generateLetters(chars, groups = 15) {
    const tokens = chars.slice();
    while (tokens.length < groups) {
      const n = 2 + rand(3);
      let tk = '';
      for (let i = 0; i < n; i++) tk += chars[rand(chars.length)];
      tokens.push(tk);
    }
    return shuffle(tokens).join(' ');
  }

  function pickWords(pool, n) {
    const out = [];
    let bag = shuffle(pool);
    while (out.length < n) {
      if (!bag.length) bag = shuffle(pool);
      out.push(bag.pop());
    }
    return out.join(' ');
  }

  function buildTarget(lesson) {
    switch (lesson.type) {
      case 'letters': return generateLetters(lesson.chars, 15);
      case 'words': {
        const pool = lesson.pool === 'short' ? SHORT_WORDS : lesson.pool === 'long' ? LONG_WORDS : WORDS;
        return pickWords(pool, 14);
      }
      case 'text': return pick(TEXTS);
      case 'stream': return pickWords(WORDS, lesson.streamCount || 60);
      case 'quran':
      case 'custom':
      case 'mistake':
      default: return lesson.text || pick(TEXTS);
    }
  }

  function buildContent() {
    if (engine.mode === 'lesson') return buildTarget(engine.lesson);
    if (engine.mode === 'time') return pickWords(WORDS, 60);
    return pickWords(WORDS, engine.wordLimit);
  }

  function buildCharDrill(ch) {
    const words = WORDS.filter((w) => Array.from(w).some((c) => normalizeChar(c) === ch));
    return generateLetters([ch], 12) + ' ' + pickWords(words.length ? words : WORDS, 8);
  }

  function makeCharLesson(ch) {
    return {
      id: 'char:' + ch, type: 'custom', text: buildCharDrill(ch),
      en: { title: translate('en', 'drill.charTitle', { ch }), sub: translate('en', 'drill.charSub'), level: 'focus' },
      ar: { title: translate('ar', 'drill.charTitle', { ch }), sub: translate('ar', 'drill.charSub'), level: 'focus' },
    };
  }

  function buildMistakeTarget() {
    const entries = Object.entries(progress.byChar)
      .filter(([c, v]) => v.err > 0 && c !== ' ')
      .map(([c, v]) => ({ c, err: v.err }))
      .sort((a, b) => b.err - a.err);

    const chars = entries.slice(0, 8).map((e) => e.c);
    let text;
    if (!chars.length) {
      text = generateLetters(['ا', 'ل', 'م', 'ن', 'س', 'ت', 'ب', 'ي'], 16);
    } else {
      const words = WORDS.filter((w) => Array.from(w).some((c) => chars.includes(normalizeChar(c))));
      text = generateLetters(chars, 11) + ' ' + pickWords(words.length ? words : WORDS, 10);
    }
    const subKey = chars.length ? 'drill.mistakeSub' : 'drill.general';
    return {
      id: 'focus', type: 'custom', text,
      en: { title: translate('en', 'drill.mistakeTitle'), sub: translate('en', subKey), level: 'focus' },
      ar: { title: translate('ar', 'drill.mistakeTitle'), sub: translate('ar', subKey), level: 'focus' },
    };
  }

  function modeLesson(mode) {
    if (mode === 'time') {
      return {
        id: 'mode:time', type: 'stream',
        en: { title: translate('en', 'mode.title.time', { n: engine.timeLimit }), sub: translate('en', 'mode.sub.time'), level: 'time' },
        ar: { title: translate('ar', 'mode.title.time', { n: engine.timeLimit }), sub: translate('ar', 'mode.sub.time'), level: 'time' },
      };
    }
    return {
      id: 'mode:words', type: 'stream', streamCount: engine.wordLimit,
      en: { title: translate('en', 'mode.title.words', { n: engine.wordLimit }), sub: translate('en', 'mode.sub.words'), level: 'words' },
      ar: { title: translate('ar', 'mode.title.words', { n: engine.wordLimit }), sub: translate('ar', 'mode.sub.words'), level: 'words' },
    };
  }

  function localized(lesson) {
    const l = lesson[lang] || lesson.en || {};
    return { title: l.title || '', sub: l.sub || '', level: t('level.' + (l.level || 'beginner')) };
  }

  function applyLessonHeader(lesson) {
    if (!lesson) return;
    const loc = localized(lesson);
    $('#lesson-title').textContent = loc.title;
    $('#lesson-sub').textContent = loc.sub;
    $('#lesson-level').textContent = loc.level;
  }

  /* ============================================================
     Typing engine
     ============================================================ */
  const engine = {
    lesson: null, target: '', chars: [], spans: [],
    index: 0, correct: 0, total: 0, errors: 0,
    streak: 0, maxStreak: 0,
    startedAt: 0, timer: null, finished: false, active: false,
    sessionMistakes: {},
    mode: settings.mode || 'lesson', timeLimit: settings.time || 30, wordLimit: settings.words || 25,
    samples: [], lastSample: 0,
  };

  const targetEl = $('#target');
  const textPanel = $('#text-panel');
  const keyEls = buildKeyboard($('#keyboard'));
  const heatKeyEls = buildKeyboard($('#keyboard-heat'));

  const isFlow = () => engine.mode === 'time' || engine.mode === 'words'
    || !!(engine.lesson && engine.lesson.flow);

  function elapsedSec() { return engine.startedAt ? (performance.now() - engine.startedAt) / 1000 : 0; }
  function netWpm() { const s = elapsedSec(); return s > 0 ? (engine.correct / 5) / (s / 60) : 0; }
  function rawWpm() { const s = elapsedSec(); return s > 0 ? (engine.total / 5) / (s / 60) : 0; }

  function renderTarget() {
    targetEl.innerHTML = '';
    engine.spans = engine.chars.map((ch) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      targetEl.appendChild(s);
      return s;
    });
    if (engine.spans[0]) engine.spans[0].classList.add('current');
  }

  function appendWords(n) {
    const clusters = splitGraphemes(' ' + pickWords(WORDS, n));
    for (const ch of clusters) {
      engine.chars.push(ch);
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      targetEl.appendChild(s);
      engine.spans.push(s);
    }
  }

  function ensureBuffer() {
    if (engine.mode !== 'time') return;
    if (engine.index >= engine.chars.length - 60) appendWords(60);
  }

  function updateNextKey() {
    for (const code in keyEls) keyEls[code].classList.remove('next');
    if (engine.finished || !engine.active) return;
    const exp = engine.chars[engine.index];
    if (exp === undefined) return;
    const code = exp === ' ' ? 'Space' : CHAR_TO_KEY[normalizeChar(exp)];
    if (code && keyEls[code]) keyEls[code].classList.add('next');
  }

  function flashWrongKey(ch) {
    const code = ch === ' ' ? 'Space' : CHAR_TO_KEY[normalizeChar(ch)];
    const el = code && keyEls[code];
    if (!el) return;
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 320);
  }

  function scrollTarget() {
    if (!isFlow()) return;
    const span = engine.spans[engine.index];
    if (!span) return;
    const lh = span.offsetHeight || 40;
    const top = span.offsetTop;
    const vh = textPanel.clientHeight;
    const cur = textPanel.scrollTop;
    if (top < cur + lh) textPanel.scrollTop = Math.max(0, top - lh);
    else if (top + lh * 2 > cur + vh) textPanel.scrollTop = top - vh + lh * 2;
  }

  /* ============================================================
     Mode bar
     ============================================================ */
  function optionBtn(label, active, onClick) {
    const b = document.createElement('button');
    b.className = 'seg-btn' + (active ? ' is-active' : '');
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function renderModeBar() {
    $$('#mode-seg .seg-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.mode === engine.mode));
    const opts = $('#mode-opts');
    opts.innerHTML = '';
    if (engine.mode === 'time') {
      for (const v of [15, 30, 60, 120]) {
        opts.appendChild(optionBtn(v + 's', v === engine.timeLimit, () => {
          engine.timeLimit = v; settings.time = v; save(); beginTest();
        }));
      }
    } else if (engine.mode === 'words') {
      for (const v of [10, 25, 50, 100]) {
        opts.appendChild(optionBtn(String(v), v === engine.wordLimit, () => {
          engine.wordLimit = v; settings.words = v; save(); beginTest();
        }));
      }
    } else {
      const hint = document.createElement('span');
      hint.className = 'muted';
      hint.textContent = t('mode.lessonHint');
      opts.appendChild(hint);
    }
  }

  function updateLessonControls() {
    const isLesson = engine.mode === 'lesson';
    $('#btn-newdrill').hidden = !isLesson;
    $('#btn-next').hidden = !isLesson;
  }

  /* ============================================================
     Test lifecycle
     ============================================================ */
  function beginTest() {
    let lesson;
    if (engine.mode === 'lesson') lesson = engine.lesson || LESSONS[0];
    else lesson = modeLesson(engine.mode);
    engine.lesson = lesson;

    engine.target = buildContent();
    engine.chars = splitGraphemes(engine.target);
    engine.spans = [];
    engine.index = 0; engine.correct = 0; engine.total = 0; engine.errors = 0;
    engine.streak = 0; engine.maxStreak = 0;
    engine.startedAt = 0; engine.timer && clearInterval(engine.timer); engine.timer = null;
    engine.finished = false; engine.active = true;
    engine.sessionMistakes = {};
    engine.samples = []; engine.lastSample = 0;

    renderTarget();
    textPanel.classList.toggle('is-flow', isFlow());
    textPanel.scrollTop = 0;
    $('#start-hint').classList.remove('hide');
    applyLessonHeader(lesson);

    updateNextKey();
    updateStats();
    updateProgressBar();
    textPanel.focus();
  }

  function startTimer() {
    engine.startedAt = performance.now();
    engine.lastSample = 0;
    engine.timer = setInterval(() => {
      if (!engine.active || engine.finished) return;
      const sec = elapsedSec();
      if (engine.mode === 'time' && sec >= engine.timeLimit) { updateStats(); finish(); return; }
      if (sec - engine.lastSample >= 1) {
        engine.lastSample = Math.floor(sec);
        engine.samples.push({ t: engine.lastSample, wpm: netWpm(), raw: rawWpm(), err: engine.errors });
      }
      updateStats();
      updateProgressBar();
      if (isFlow()) scrollTarget();
    }, 200);
  }

  function updateProgressBar() {
    let pct;
    if (engine.mode === 'time') pct = engine.timeLimit ? (elapsedSec() / engine.timeLimit) * 100 : 0;
    else pct = engine.chars.length ? (engine.index / engine.chars.length) * 100 : 0;
    pct = Math.max(0, Math.min(100, pct));
    $('#progress-fill').style.width = pct + '%';
    $('#progress-pct').textContent = Math.round(pct) + '%';
  }

  function updateStats() {
    const sec = elapsedSec();
    const acc = engine.total ? (engine.correct / engine.total) * 100 : 100;
    $('#stat-wpm').textContent = Math.round(netWpm());
    $('#stat-acc').textContent = Math.round(acc) + '%';
    $('#stat-errors').textContent = engine.errors;
    $('#stat-streak').textContent = engine.streak;
    $('#stat-time').textContent = engine.mode === 'time'
      ? fmtTime(Math.max(0, engine.timeLimit - sec))
      : fmtTime(sec);
  }

  function recordChar(expected, ok, wrong) {
    const p = progress.byChar[expected] || (progress.byChar[expected] = { ok: 0, err: 0, conf: {} });
    if (ok) p.ok++;
    else {
      p.err++;
      if (wrong) p.conf[wrong] = (p.conf[wrong] || 0) + 1;
    }
    progress.totalKeystrokes++;
    if (ok) progress.totalCorrect++;
    save();
  }

  function advance() {
    const s = engine.spans[engine.index];
    if (s) { s.classList.remove('current'); s.classList.remove('error'); s.classList.add('done'); }
    engine.index++;
    if (engine.mode === 'time') ensureBuffer();
    updateProgressBar();
    if (engine.index >= engine.chars.length) { finish(); return; }
    const next = engine.spans[engine.index];
    if (next) next.classList.add('current');
    updateNextKey();
    scrollTarget();
  }

  function onCorrect() {
    engine.total++;
    engine.correct++;
    engine.streak++;
    engine.maxStreak = Math.max(engine.maxStreak, engine.streak);
    recordChar(normalizeChar(engine.chars[engine.index]), true, null);
    beep(720 + Math.min(engine.streak, 8) * 25, 0.05, 'triangle', 0.03);
    advance();
    updateStats();
  }

  function onWrong(ch) {
    engine.total++;
    engine.errors++;
    engine.streak = 0;
    const exp = engine.chars[engine.index];
    recordChar(normalizeChar(exp), false, normalizeChar(ch));
    engine.sessionMistakes[normalizeChar(exp)] = (engine.sessionMistakes[normalizeChar(exp)] || 0) + 1;

    const s = engine.spans[engine.index];
    if (s) s.classList.add('error');

    flashWrongKey(ch);
    textPanel.classList.remove('shake');
    void textPanel.offsetWidth;
    textPanel.classList.add('shake');
    beep(180, 0.12, 'sawtooth', 0.05);

    if (!settings.stopOnError) {
      if (s) s.classList.remove('current');
      engine.index++;
      if (engine.mode === 'time') ensureBuffer();
      updateProgressBar();
      if (engine.index >= engine.chars.length) { finish(); return; }
      const next = engine.spans[engine.index];
      if (next) next.classList.add('current');
      updateNextKey();
      scrollTarget();
    }
    updateStats();
  }

  function handleChar(ch) {
    if (!engine.active || engine.finished) return;
    if (!engine.startedAt) startTimer();
    $('#start-hint').classList.add('hide');

    const exp = engine.chars[engine.index];
    if (exp === undefined) return;
    const ok = ch === exp || normalizeChar(ch) === normalizeChar(exp);
    if (ok) onCorrect(); else onWrong(ch);
  }

  function computeConsistency() {
    const raws = engine.samples.map((s) => s.raw).filter((v) => v > 0);
    if (raws.length < 2) return 100;
    const mean = raws.reduce((a, b) => a + b, 0) / raws.length;
    if (!mean) return 100;
    const variance = raws.reduce((a, b) => a + (b - mean) * (b - mean), 0) / raws.length;
    const cv = Math.sqrt(variance) / mean;
    return Math.max(0, Math.round((1 - cv) * 100));
  }

  function finish() {
    if (engine.finished) return;
    engine.finished = true;
    if (engine.timer) { clearInterval(engine.timer); engine.timer = null; }
    for (const code in keyEls) keyEls[code].classList.remove('next');

    const sec = elapsedSec();
    const wpm = netWpm();
    const raw = rawWpm();
    const acc = engine.total ? (engine.correct / engine.total) * 100 : 100;
    const cons = computeConsistency();

    let missed = 0;
    if (engine.mode === 'time') {
      for (let i = engine.index; i < engine.chars.length && engine.chars[i] !== ' '; i++) missed++;
    }
    engine.samples.push({ t: Math.max(1, Math.round(sec)), wpm, raw, err: engine.errors });

    if (engine.mode === 'lesson') {
      const l = progress.lessons[engine.lesson.id] || (progress.lessons[engine.lesson.id] = { done: false, bestWpm: 0, bestAcc: 0, runs: 0 });
      l.done = true;
      l.runs++;
      l.bestWpm = Math.max(l.bestWpm, Math.round(wpm));
      l.bestAcc = Math.max(l.bestAcc, Math.round(acc));
    }

    progress.sessions++;
    progress.bestWpm = Math.max(progress.bestWpm, Math.round(wpm));
    progress.bestAcc = Math.max(progress.bestAcc, Math.round(acc));

    const today = new Date(); const day = today.toISOString().slice(0, 10);
    if (progress.lastDay !== day) {
      const y = new Date(today.getTime() - 864e5).toISOString().slice(0, 10);
      progress.dayStreak = progress.lastDay === y ? progress.dayStreak + 1 : 1;
      progress.lastDay = day;
    }
    saveNow();

    updateStats();
    renderFocus();
    renderProgress();
    showResults({ wpm, raw, acc, cons, sec, missed });
  }

  /* ============================================================
     Results
     ============================================================ */
  function showResults({ wpm, raw, acc, cons, sec, missed }) {
    $('#r-wpm').textContent = Math.round(wpm);
    $('#r-raw').textContent = Math.round(raw);
    $('#r-acc').textContent = Math.round(acc) + '%';
    $('#r-cons').textContent = cons + '%';
    $('#r-time').textContent = fmtTime(sec);
    $('#rc-correct').textContent = engine.correct;
    $('#rc-incorrect').textContent = engine.errors;
    $('#rc-missed').textContent = missed;
    $('#rc-extra').textContent = 0;

    let tk = 'result.tDone', sk = 'result.sDone';
    if (acc >= 98 && wpm >= 30) { tk = 'result.tPerfect'; sk = 'result.sPerfect'; }
    else if (acc >= 95) { tk = 'result.tGreat'; sk = 'result.sGreat'; }
    else if (acc < 80) { tk = 'result.tLow'; sk = 'result.sLow'; }
    $('#result-title').textContent = t(tk);
    $('#result-sub').textContent = t(sk);
    $('#result-glow').style.background = acc >= 95
      ? 'radial-gradient(circle, rgba(52,211,153,0.45), transparent 70%)'
      : acc < 80
        ? 'radial-gradient(circle, rgba(251,113,133,0.45), transparent 70%)'
        : 'radial-gradient(circle, rgba(56,189,248,0.42), transparent 70%)';

    const mist = Object.entries(engine.sessionMistakes).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const wrap = $('#result-mistakes');
    wrap.innerHTML = '';
    if (mist.length) {
      const title = document.createElement('div');
      title.className = 'rm-title';
      title.textContent = t('result.mistakesTitle');
      wrap.appendChild(title);
      const row = document.createElement('div');
      row.className = 'rm-chars';
      for (const [c] of mist) {
        const s = document.createElement('span');
        s.className = 'rm-char';
        s.textContent = c;
        row.appendChild(s);
      }
      wrap.appendChild(row);
    }
    openModal('#modal-results');
    drawChart();
  }

  function drawChart() {
    const c = $('#result-chart');
    if (!c) return;
    try {
      const accent = cssVar('--accent') || '#38bdf8';
      const bad = cssVar('--bad') || '#fb7185';
      const muted = cssVar('--muted') || '#8ba0be';
      const border = cssVar('--panel-border') || 'rgba(255,255,255,0.1)';
      const dpr = window.devicePixelRatio || 1;
      const W = c.clientWidth || 520, H = 160;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const s = engine.samples.slice();
      const padL = 34, padR = 10, padT = 12, padB = 20;
      const cw = Math.max(1, W - padL - padR), ch = Math.max(1, H - padT - padB);
      const maxT = Math.max(1, ...s.map((p) => p.t));
      const maxY = Math.max(20, ...s.map((p) => Math.max(p.wpm, p.raw))) * 1.1;
      const X = (v) => padL + (v / maxT) * cw;
      const Y = (v) => padT + (1 - v / maxY) * ch;

      ctx.strokeStyle = border; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padT + (ch * i / 4);
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      }
      ctx.fillStyle = muted; ctx.font = '10px sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) ctx.fillText(String(Math.round(maxY * (1 - i / 4))), padL - 6, padT + ch * i / 4);
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const xt = Math.min(6, maxT);
      for (let i = 0; i <= xt; i++) ctx.fillText(Math.round(maxT * i / xt) + 's', padL + cw * i / xt, H - padB + 4);

      const line = (key, color, width) => {
        if (s.length < 1) return;
        ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width;
        s.forEach((p, i) => { const x = X(p.t), y = Y(p[key]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
        ctx.stroke();
      };
      line('raw', muted, 1.5);
      line('wpm', accent, 2.5);

      ctx.fillStyle = bad;
      for (let i = 0; i < s.length; i++) {
        const prev = i > 0 ? s[i - 1].err : 0;
        if (s[i].err > prev) {
          ctx.beginPath(); ctx.arc(X(s[i].t), Y(s[i].wpm), 3, 0, Math.PI * 2); ctx.fill();
        }
      }
    } catch (e) { /* ignore chart errors */ }
  }

  /* ============================================================
     Modals
     ============================================================ */
  function openModal(sel) { $(sel).hidden = false; }
  function closeModal(sel) { $(sel).hidden = true; }

  /* ============================================================
     Focus view
     ============================================================ */
  function renderFocus() {
    const entries = Object.entries(progress.byChar)
      .filter(([, v]) => v.err > 0)
      .map(([c, v]) => ({ c, err: v.err, ok: v.ok }))
      .sort((a, b) => b.err - a.err);

    const visualEntries = entries.filter((e) => e.c !== ' ');
    const totalErr = entries.reduce((s, e) => s + e.err, 0);
    const badge = $('#focus-badge');
    if (totalErr > 0) { badge.hidden = false; badge.textContent = String(totalErr); }
    else badge.hidden = true;

    const chips = $('#focus-chips');
    chips.innerHTML = '';
    if (!visualEntries.length) {
      const span = document.createElement('span');
      span.className = 'muted';
      span.textContent = t('focus.noChars');
      chips.appendChild(span);
    } else {
      const maxErr = visualEntries[0].err;
      for (const e of visualEntries.slice(0, 12)) {
        const btn = document.createElement('button');
        btn.className = 'chip';
        const ratio = e.err / maxErr;
        btn.dataset.heat = ratio > 0.66 ? '3' : ratio > 0.33 ? '2' : '1';
        btn.title = t('drill.charTitle', { ch: e.c });
        btn.textContent = e.c;
        const small = document.createElement('small');
        small.textContent = e.err;
        btn.appendChild(small);
        btn.addEventListener('click', () => startCustomLesson(makeCharLesson(e.c)));
        chips.appendChild(btn);
      }
    }

    const confList = [];
    for (const [exp, v] of Object.entries(progress.byChar)) {
      for (const [wrong, n] of Object.entries(v.conf || {})) confList.push({ from: wrong, to: exp, n });
    }
    confList.sort((a, b) => b.n - a.n);
    const confEl = $('#focus-confusions');
    confEl.innerHTML = '';
    if (!confList.length) {
      confEl.innerHTML = `<span class="muted">${t('focus.noConf')}</span>`;
    } else {
      for (const c of confList.slice(0, 8)) {
        const row = document.createElement('div');
        row.className = 'confusion-row';
        row.innerHTML =
          `<span class="confusion-from">${c.from === ' ' ? '␣' : c.from}</span>` +
          `<span class="confusion-arrow">⟶</span>` +
          `<span class="confusion-to">${c.to === ' ' ? '␣' : c.to}</span>` +
          `<span class="confusion-count">${t('focus.times', { n: c.n })}</span>`;
        confEl.appendChild(row);
      }
    }

    const bars = $('#focus-bars');
    const empty = $('#focus-empty');
    bars.innerHTML = '';
    if (!visualEntries.length) {
      empty.hidden = false;
    } else {
      empty.hidden = true;
      const maxErr = visualEntries[0].err;
      for (const e of visualEntries.slice(0, 12)) {
        const row = document.createElement('div');
        row.className = 'focus-bar';
        const pct = Math.max(6, (e.err / maxErr) * 100);
        const acc = e.ok + e.err ? Math.round((e.ok / (e.ok + e.err)) * 100) : 0;
        row.innerHTML =
          `<span class="fb-char">${e.c}</span>` +
          `<span class="fb-track"><span class="fb-fill" style="width:${pct}%"></span></span>` +
          `<span class="fb-count">${t('focus.errAcc', { e: e.err, a: acc })}</span>`;
        bars.appendChild(row);
      }
    }
  }

  /* ============================================================
     Progress view
     ============================================================ */
  function heatLevel(stat) {
    if (!stat) return 0;
    const total = stat.ok + stat.err;
    if (!total) return 0;
    const acc = stat.ok / total;
    if (acc >= 0.98) return 1;
    if (acc >= 0.9) return 2;
    if (acc >= 0.8) return 3;
    return 4;
  }

  function applyHeat() {
    for (const row of KEY_ROWS) for (const k of row) {
      if (k.special || !k.ar || k.ligature) continue;
      const el = heatKeyEls[k.code];
      if (!el) continue;
      const stat = progress.byChar[normalizeChar(k.ar)];
      const level = heatLevel(stat);
      el.classList.remove('heat-1', 'heat-2', 'heat-3', 'heat-4');
      if (level) el.classList.add('heat-' + level);
      if (stat) {
        const total = stat.ok + stat.err;
        const acc = total ? Math.round((stat.ok / total) * 100) : 0;
        el.title = t('progress.keyStat', { ch: k.ar, a: acc, e: stat.err });
      } else {
        el.title = t('progress.noData', { ch: k.ar });
      }
    }
  }

  function renderProgress() {
    $('#p-best-wpm').textContent = progress.bestWpm;
    $('#p-best-acc').textContent = progress.bestAcc + '%';
    $('#p-sessions').textContent = progress.sessions;
    $('#p-streak').textContent = progress.dayStreak;
    const doneCount = Object.values(progress.lessons).filter((l) => l.done).length;
    $('#p-lessons').textContent = `${doneCount}/${LESSONS.length}`;

    const list = $('#lessons-list');
    list.innerHTML = '';
    for (const lesson of LESSONS) {
      const rec = progress.lessons[lesson.id];
      const loc = localized(lesson);
      const row = document.createElement('div');
      row.className = 'lesson-row';
      const done = rec && rec.done;
      row.innerHTML =
        `<span class="lr-status">${done ? '✅' : '○'}</span>` +
        `<span class="lr-name">${loc.title}<div class="lr-sub">${loc.sub}</div></span>` +
        `<span class="lr-score">${rec ? t('progress.bestScore', { w: rec.bestWpm, a: rec.bestAcc }) : ''}</span>` +
        `<span class="lr-level">${loc.level}</span>`;
      row.addEventListener('click', () => startLessonAt(LESSONS.indexOf(lesson)));
      list.appendChild(row);
    }
    applyHeat();
  }

  /* ============================================================
     View switching
     ============================================================ */
  let currentView = 'practice';
  function showView(name) {
    currentView = name;
    $$('.view').forEach((v) => v.classList.toggle('is-active', v.id === 'view-' + name));
    $$('.tab').forEach((tb) => tb.classList.toggle('is-active', tb.dataset.view === name));
    if (name === 'focus') renderFocus();
    if (name === 'progress') renderProgress();
    if (name === 'quran') {
      if (!quran.inited) { quran.inited = true; quranInit(); }
      else { renderSurahList(); setQuranStatus(quranStatusText()); }
    }
    if (name === 'practice') { textPanel.focus(); updateNextKey(); }
  }

  /* ============================================================
     Start helpers
     ============================================================ */
  let currentLessonIndex = 0;

  function startLessonAt(i) {
    engine.mode = 'lesson'; settings.mode = 'lesson'; save();
    currentLessonIndex = ((i % LESSONS.length) + LESSONS.length) % LESSONS.length;
    engine.lesson = LESSONS[currentLessonIndex];
    renderModeBar();
    updateLessonControls();
    beginTest();
    showView('practice');
  }

  function startCustomLesson(lesson) {
    engine.mode = 'lesson'; settings.mode = 'lesson'; save();
    engine.lesson = lesson;
    renderModeBar();
    updateLessonControls();
    beginTest();
    showView('practice');
  }

  function startMode(mode) {
    engine.mode = mode; settings.mode = mode; save();
    renderModeBar();
    updateLessonControls();
    beginTest();
    showView('practice');
  }

  /* ============================================================
     Keyboard input
     ============================================================ */
  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'SELECT' || ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;

    if (!$('#modal-results').hidden || !$('#modal-help').hidden) {
      if (e.key === 'Escape') { closeModal('#modal-results'); closeModal('#modal-help'); }
      return;
    }

    // Tab restarts the current test (only while the typing area has focus)
    if (e.code === 'Tab' && currentView === 'practice' && engine.active
      && (ae === document.body || ae === textPanel || !ae)) {
      e.preventDefault();
      beginTest();
      toast(t('toast.restart'));
      return;
    }

    if (currentView !== 'practice' || !engine.active || engine.finished) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    let ch = null;
    if (e.code === 'Space' || e.key === ' ') ch = ' ';
    else if (CODE_TO_CHAR[e.code]) ch = CODE_TO_CHAR[e.code];
    else if (e.key && Array.from(e.key).length === 1) ch = e.key;

    if (ch === null) return;
    if (ch === ' ') e.preventDefault();
    if (e.code === 'Backspace') e.preventDefault();
    handleChar(ch);
  });

  textPanel.addEventListener('click', () => textPanel.focus());

  /* ============================================================
     Controls
     ============================================================ */
  $('#btn-restart').addEventListener('click', () => beginTest());
  $('#btn-newdrill').addEventListener('click', () => { beginTest(); toast(t('toast.newDrill')); });
  $('#btn-next').addEventListener('click', () => {
    if (engine.lesson && engine.lesson.id.startsWith('char:')) { startLessonAt(0); return; }
    startLessonAt(currentLessonIndex + 1);
  });

  $('#opt-keyboard').addEventListener('change', (e) => {
    settings.showKeyboard = e.target.checked;
    $('#keyboard-wrap').classList.toggle('hidden', !settings.showKeyboard);
    save();
  });
  $('#opt-stoperror').addEventListener('change', (e) => { settings.stopOnError = e.target.checked; save(); });
  $('#opt-font').addEventListener('change', (e) => {
    if (e.target.value === '__custom') { fontFile.click(); return; }
    settings.font = e.target.value;
    applyFont();
    save();
  });
  $('#btn-sound').addEventListener('click', () => {
    settings.sound = !settings.sound;
    $('#btn-sound').setAttribute('aria-pressed', String(settings.sound));
    $('#btn-sound').textContent = settings.sound ? '🔊' : '🔇';
    save();
  });
  $('#btn-theme').addEventListener('click', () => {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    save();
  });
  $('#btn-lang').addEventListener('click', () => {
    lang = lang === 'en' ? 'ar' : 'en';
    settings.lang = lang;
    applyLang();
    saveNow();
  });
  $('#btn-help').addEventListener('click', () => openModal('#modal-help'));
  $('#btn-help-close').addEventListener('click', () => closeModal('#modal-help'));

  $$('.tab').forEach((tb) => tb.addEventListener('click', () => showView(tb.dataset.view)));
  $$('#mode-seg .seg-btn').forEach((b) => b.addEventListener('click', () => startMode(b.dataset.mode)));

  $('#btn-focus-start').addEventListener('click', () => startCustomLesson(buildMistakeTarget()));
  $('#btn-focus-reset').addEventListener('click', () => {
    progress.byChar = {};
    saveNow();
    renderFocus();
    renderProgress();
    toast(t('toast.mistakesReset'));
  });
  $('#btn-progress-reset').addEventListener('click', () => {
    if (!confirm(t('confirm.reset'))) return;
    const keep = progress.settings;
    const fresh = defaultProgress();
    fresh.settings = keep;
    Object.keys(progress).forEach((k) => delete progress[k]);
    Object.assign(progress, fresh);
    lang = keep.lang === 'ar' ? 'ar' : 'en';
    saveNow();
    applyLang();
    toast(t('toast.allReset'));
  });

  $('#btn-result-retry').addEventListener('click', () => { closeModal('#modal-results'); beginTest(); });
  $('#btn-result-next').addEventListener('click', () => {
    closeModal('#modal-results');
    startLessonAt(currentLessonIndex + 1);
  });
  $('#btn-result-focus').addEventListener('click', () => {
    closeModal('#modal-results');
    startCustomLesson(buildMistakeTarget());
  });

  /* ============================================================
     Quran library — API + offline cache
     ============================================================ */
  const QURAN_STORE = 'typearabic.quran.v2';
  const quran = {
    list: null,            // surah metadata
    surahs: {},            // number -> { number, name, englishName, ayahs:[{n,text}] }
    selected: null,        // selected surah number
    selectedSurah: null,   // loaded surah object
    downloading: false,
    inited: false,
  };

  function quranLoadCache() {
    try {
      const raw = localStorage.getItem(QURAN_STORE);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.list) quran.list = d.list;
      if (d.surahs) quran.surahs = d.surahs;
    } catch (e) { /* ignore */ }
  }

  function quranSaveCache() {
    try {
      localStorage.setItem(QURAN_STORE, JSON.stringify({
        list: quran.list, surahs: quran.surahs, updated: Date.now(),
      }));
      return true;
    } catch (e) { return false; }
  }

  /* Remove diacritics / Quranic marks so the text is typable on the
     on-screen layout (which has no harakat keys). The `quran-simple`
     edition uses standard imla spelling, so dropping the marks keeps
     words correct (e.g. الرحمن, مالك, العالمين).                       */
  function stripTashkeel(s) {
    return s.replace(/[\u200B-\u200F\uFEFF\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u08D3-\u08FF]/g, '');
  }

  /* alquran.cloud prepends the Bismillah to ayah 1 of every surah.
     It is a real ayah only in Al-Fatiha (1); elsewhere drop it.     */
  function quranStripBismillah(raw) {
    const m = '[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]*';
    const L = (ch) => ch + m;
    const bism =
      '\\uFEFF?\\s*' +
      L('ب') + L('س') + L('م') + '\\s+' +
      L('ا') + L('ل') + L('ل') + L('ه') + '\\s+' +
      L('ا') + L('ل') + L('ر') + L('ح') + L('م') + L('ن') + '\\s+' +
      L('ا') + L('ل') + L('ر') + L('ح') + L('ي') + L('م');
    return raw.replace(new RegExp('^' + bism + '\\s*'), '');
  }

  function prepareQuranText(surah, from, to, harakat) {
    const parts = [];
    for (const a of surah.ayahs) {
      if (a.n < from || a.n > to) continue;
      let txt = a.text;
      if (a.n === 1 && surah.number !== 1) txt = quranStripBismillah(txt);
      parts.push(txt);
    }
    let t = parts.join(' ');
    t = t.replace(/\u0671/g, '\u0627'); // alef wasla -> plain alef
    if (!harakat) t = stripTashkeel(t);
    return t.replace(/\s+/g, ' ').trim();
  }

  async function quranFetchList() {
    const r = await fetch(QURAN_API + '/surah');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    return (j.data || []).map((s) => ({
      number: s.number, name: s.name, englishName: s.englishName,
      translation: s.englishNameTranslation, ayahs: s.numberOfAyahs,
      type: s.revelationType,
    }));
  }

  async function quranLoadList(force) {
    if (!quran.list) {
      try {
        const lr = await fetch('quran-local.json', { cache: 'no-store' });
        if (lr.ok) {
          const lj = await lr.json();
          if (lj && lj.list) quran.list = lj.list;
          if (lj && lj.surahs) Object.assign(quran.surahs, lj.surahs);
        }
      } catch (e) { /* no local file */ }
    }
    if (quran.list && !force) return quran.list;
    quran.list = await quranFetchList();
    quranSaveCache();
    return quran.list;
  }

  async function quranFetchSurah(n) {
    const r = await fetch(`${QURAN_API}/surah/${n}/${QURAN_EDITION}`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    const d = j.data || {};
    return {
      number: d.number, name: d.name, englishName: d.englishName,
      ayahs: (d.ayahs || []).map((a) => ({ n: a.numberInSurah, text: a.text })),
      cachedAt: Date.now(),
    };
  }

  async function quranLoadSurah(n, force) {
    if (quran.surahs[n] && !force) return quran.surahs[n];
    const s = await quranFetchSurah(n);
    quran.surahs[n] = s;
    quranSaveCache();
    return s;
  }

  const quranOfflineCount = () => Object.keys(quran.surahs).length;
  function setQuranStatus(msg) { const el = $('#quran-status'); if (el) el.textContent = msg; }
  function quranStatusText() {
    return t('quran.status', { n: quran.list ? quran.list.length : 0, c: quranOfflineCount() });
  }

  function renderSurahList() {
    const wrap = $('#surah-list');
    if (!wrap) return;
    if (!quran.list) { wrap.innerHTML = ''; return; }
    const q = ($('#quran-search').value || '').trim().toLowerCase();
    const list = quran.list.filter((s) => {
      if (!q) return true;
      return String(s.number) === q || s.name.includes(q)
        || (s.englishName || '').toLowerCase().includes(q)
        || (s.translation || '').toLowerCase().includes(q);
    });
    wrap.innerHTML = '';
    if (!list.length) {
      const none = document.createElement('div');
      none.className = 'muted';
      none.style.padding = '10px';
      none.textContent = t('quran.noMatch');
      wrap.appendChild(none);
      return;
    }
    for (const s of list) {
      const offline = !!quran.surahs[s.number];
      const row = document.createElement('button');
      row.className = 'surah-row' + (quran.selected === s.number ? ' is-active' : '');
      row.dataset.number = s.number;
      row.innerHTML =
        `<span class="surah-num">${s.number}</span>` +
        `<span class="surah-name" dir="rtl" lang="ar">${s.name}</span>` +
        `<span class="surah-en">${s.englishName}</span>` +
        `<span class="surah-meta">${t('quran.ayahs', { n: s.ayahs })}</span>` +
        `<span class="surah-dot${offline ? ' on' : ''}" title="${offline ? t('quran.offlineDot') : ''}"></span>`;
      row.addEventListener('click', () => quranSelect(s.number));
      wrap.appendChild(row);
    }
  }

  async function quranSelect(n) {
    quran.selected = n;
    renderSurahList();
    const meta = (quran.list || []).find((s) => s.number === n)
      || { number: n, name: '', englishName: '', ayahs: 0 };
    $('#quran-pick-empty').hidden = true;
    $('#quran-pick-body').hidden = false;
    $('#quran-pick-title').textContent = `${meta.number}. ${meta.englishName} — ${meta.name}`;
    $('#quran-pick-meta').textContent =
      `${t('quran.ayahs', { n: meta.ayahs })} · ${meta.type === 'Medinan' ? t('quran.medinan') : t('quran.meccan')}`;
    $('#quran-preview').textContent = t('quran.loading');
    try {
      const s = await quranLoadSurah(n);
      quran.selectedSurah = s;
      const fromEl = $('#quran-from'), toEl = $('#quran-to');
      fromEl.min = toEl.min = 1;
      fromEl.max = toEl.max = s.ayahs.length;
      fromEl.value = 1;
      toEl.value = Math.min(10, s.ayahs.length);
      updateQuranPreview();
      renderSurahList();
      setQuranStatus(quranStatusText());
    } catch (e) {
      quran.selectedSurah = null;
      $('#quran-preview').textContent = t('quran.notCached');
    }
  }

  function updateQuranPreview() {
    const s = quran.selectedSurah;
    if (!s) return;
    const from = Math.max(1, Math.min(s.ayahs.length, parseInt($('#quran-from').value, 10) || 1));
    const to = Math.max(from, Math.min(s.ayahs.length, parseInt($('#quran-to').value, 10) || from));
    const text = prepareQuranText(s, from, to, $('#quran-harakat').checked);
    $('#quran-preview').textContent = text.length > 420 ? text.slice(0, 420) + ' …' : text;
    const start = $('#quran-start');
    start.dataset.from = String(from);
    start.dataset.to = String(to);
  }

  function quranQuick(kind) {
    const s = quran.selectedSurah;
    if (!s) return;
    const n = s.ayahs.length;
    if (kind === 'first10') { $('#quran-from').value = 1; $('#quran-to').value = Math.min(10, n); }
    else if (kind === 'all') { $('#quran-from').value = 1; $('#quran-to').value = n; }
    else if (kind === 'random') { const r = 1 + rand(n); $('#quran-from').value = r; $('#quran-to').value = r; }
    updateQuranPreview();
  }

  function makeQuranLesson(meta, surah, from, to, harakat) {
    const text = prepareQuranText(surah, from, to, harakat);
    const enRange = from === to ? 'Ayah ' + from : 'Ayahs ' + from + '–' + to;
    const arRange = from === to ? 'آية ' + from : 'الآيات ' + from + '–' + to;
    return {
      id: `quran:${meta.number}:${from}-${to}`,
      type: 'quran', text, flow: true,
      en: { title: `${meta.englishName} · ${enRange}`, sub: t('quran.ayahs', { n: meta.ayahs }), level: 'quran' },
      ar: { title: `${meta.name} · ${arRange}`, sub: `${meta.ayahs} آية`, level: 'quran' },
    };
  }

  function quranStart() {
    const s = quran.selectedSurah;
    if (!s) return;
    const meta = (quran.list || []).find((x) => x.number === s.number) || s;
    const from = parseInt($('#quran-start').dataset.from, 10) || 1;
    const to = parseInt($('#quran-start').dataset.to, 10) || from;
    startCustomLesson(makeQuranLesson(meta, s, from, to, $('#quran-harakat').checked));
  }

  async function quranSaveSelectedOffline() {
    if (!quran.selected) return;
    try {
      await quranLoadSurah(quran.selected, true);
      renderSurahList();
      setQuranStatus(quranStatusText());
      toast(t('quran.savedOffline'));
    } catch (e) { toast(t('quran.saveFailed')); }
  }

  async function quranDownloadAll() {
    if (quran.downloading) return;
    if (!quran.list) {
      try { await quranLoadList(); } catch (e) { setQuranStatus(t('quran.errorList')); return; }
    }
    quran.downloading = true;
    const btn = $('#quran-download-all');
    btn.disabled = true;
    let done = 0;
    try {
      for (const s of quran.list) {
        if (!quran.surahs[s.number]) {
          try { await quranLoadSurah(s.number); } catch (e) { /* skip on failure */ }
        }
        done++;
        setQuranStatus(t('quran.downloading', { done, total: quran.list.length }));
        if (done % 8 === 0) renderSurahList();
        await new Promise((r) => setTimeout(r, 80));
      }
      renderSurahList();
      setQuranStatus(quranStatusText());
      toast(t('quran.downloaded', { n: quranOfflineCount() }));
    } finally {
      quran.downloading = false;
      btn.disabled = false;
    }
  }

  function quranExport() {
    const data = JSON.stringify({ list: quran.list, surahs: quran.surahs, updated: Date.now() });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'typearabic-quran.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const quranFile = document.createElement('input');
  quranFile.type = 'file';
  quranFile.accept = '.json,application/json';
  quranFile.hidden = true;
  document.body.appendChild(quranFile);
  quranFile.addEventListener('change', () => {
    const f = quranFile.files && quranFile.files[0];
    quranFile.value = '';
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(String(reader.result));
        if (d.list) quran.list = d.list;
        if (d.surahs) Object.assign(quran.surahs, d.surahs);
        quranSaveCache();
        renderSurahList();
        setQuranStatus(quranStatusText());
        toast(t('quran.imported'));
      } catch (e) { toast(t('quran.importFailed')); }
    };
    reader.readAsText(f);
  });

  function quranInit() {
    quranLoadCache();
    renderSurahList();
    setQuranStatus(quran.list ? quranStatusText() : t('quran.loadingList'));
    quranLoadList()
      .then(() => {
        renderSurahList();
        setQuranStatus(quranStatusText());
        if (quran.selected) quranSelect(quran.selected);
      })
      .catch(() => {
        setQuranStatus(quran.list ? t('quran.offlineList') : t('quran.errorList'));
      });
  }

  $('#quran-search').addEventListener('input', renderSurahList);
  $('#quran-from').addEventListener('input', updateQuranPreview);
  $('#quran-to').addEventListener('input', updateQuranPreview);
  $('#quran-harakat').addEventListener('change', () => {
    settings.quranHarakat = $('#quran-harakat').checked;
    save();
    updateQuranPreview();
  });
  $('#quran-start').addEventListener('click', quranStart);
  $('#quran-offline').addEventListener('click', quranSaveSelectedOffline);
  $('#quran-download-all').addEventListener('click', quranDownloadAll);
  $('#quran-export').addEventListener('click', quranExport);
  $('#quran-import').addEventListener('click', () => quranFile.click());
  $('#quran-clear').addEventListener('click', () => {
    quran.surahs = {};
    quranSaveCache();
    renderSurahList();
    setQuranStatus(quranStatusText());
    toast(t('quran.cleared'));
  });
  $$('#view-quran .chipbtn').forEach((b) => b.addEventListener('click', () => quranQuick(b.dataset.quick)));

  /* ============================================================
     Theme & language application
     ============================================================ */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', settings.theme);
    $('#btn-theme').textContent = settings.theme === 'dark' ? '🌙' : '☀️';
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('app.title');
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    $$('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    const langBtn = $('#btn-lang');
    langBtn.textContent = lang === 'ar' ? 'EN' : 'ع';
    langBtn.title = t('tool.lang');

    populateFonts();
    applyFont();
    buildLegend();
    renderModeBar();
    updateLessonControls();
    if (engine.lesson) applyLessonHeader(engine.lesson);
    renderFocus();
    renderProgress();
    if (quran.list) { renderSurahList(); setQuranStatus(quranStatusText()); }
  }

  /* ============================================================
     Init
     ============================================================ */
  applyTheme();
  $('#btn-sound').setAttribute('aria-pressed', String(settings.sound));
  $('#btn-sound').textContent = settings.sound ? '🔊' : '🔇';
  $('#opt-keyboard').checked = settings.showKeyboard;
  $('#opt-stoperror').checked = settings.stopOnError;
  $('#quran-harakat').checked = !!settings.quranHarakat;
  $('#keyboard-wrap').classList.toggle('hidden', !settings.showKeyboard);

  if (settings.customFont && settings.customFont.family && settings.customFont.data) {
    registerCustomFont(settings.customFont.family, settings.customFont.data);
  }

  currentLessonIndex = 0;
  engine.lesson = LESSONS[0];
  applyLang();
  beginTest();
  showView('practice');
})();

# TypeArabic — Learn Arabic Typing

A small, self-contained web app for learning to type in Arabic on a normal
(QWERTY) keyboard. Its headline feature is **Mistake Focus**: the app watches
every letter you miss and builds a personalised drill from the letters that
trip you up most.

The interface is **English by default**, with a one-click Arabic switch
(`ع` / `EN` in the top bar).

## Features

- **Type without changing your system language.** The app maps your physical
  keys to Arabic letters, so `h` types `ا`, `g` types `ل`, and so on — exactly
  like the standard Arabic 101 layout. It also accepts real Arabic input.
- **Live feedback.** The next key lights up on an on-screen keyboard; correct
  letters brighten, wrong keys flash red and (optionally) block until fixed.
- **Mistake Focus mode.** Per-letter and per-confusion tracking, a "difficult
  letters" list, and auto-generated drills weighted toward your errors. Click
  any letter chip to drill it on its own.
- **MonkeyType-style modes.** Switch between **Lesson**, **Time** (15/30/60/120s)
  and **Words** (10/25/50/100) at the top. Time and Words stream fresh words and
  finish on the clock or at the last word; results show WPM, raw WPM, accuracy,
  consistency, character breakdown and a live WPM/error chart. Press `Tab` while
  typing to restart instantly.
- **Quran library.** A built-in library of all 114 surahs. The surah list and
  verse text come from the public [alquran.cloud](https://alquran.cloud) API and
  are cached in `localStorage`, so anything you open keeps working offline — or
  hit **Download all** to make the whole Quran available without a connection
  (~0.8 MB of text). Pick a surah and an ayah range, preview it, then start
  typing. Diacritics are stripped by default so the text is typable on the
  on-screen layout (which has no harakat keys); enable **Show harakat** for a
  harder challenge. The Bismillah is shown only where it is a genuine ayah
  (Al-Fatiha) and stripped elsewhere. Export/import the cached text as JSON, or
  drop a `quran-local.json` next to the app to seed it without any network.
- **Font switcher.** Choose the Arabic display font from Noto Naskh, Noto Sans
  Arabic, Scheherazade New, Amiri, Cairo, Parastoo, Lateef, Aref Ruqaa, Reem
  Kufi, Gulzar (Nastaliq), a locally-installed KFGQPC Hafs, or upload your own
  `.ttf/.otf/.woff` — the choice is remembered.
- **Guided course.** Home row → top row → bottom row → full alphabet → words →
  sentences.
- **Progress.** WPM, accuracy, streak, per-lesson bests, day streak, and a
  per-letter accuracy heatmap on the keyboard.
- **Extras.** Finger-colour legend, sound feedback, dark/light theme,
  keyboard show/hide, stop-on-error toggle.
- **Flat, clean interface.** Solid surfaces with no gradients or glows, English
  by default with a full RTL Arabic translation.

## Running it

No build step and no dependencies. Either:

```sh
# 1) simplest: just open the file
start index.html        # Windows
# open index.html       # macOS

# 2) or serve it (needed if your browser blocks localStorage on file://)
python -m http.server 8765
# then open http://127.0.0.1:8765/index.html
```

Progress is stored in `localStorage`. The Quran cache is stored separately
(`typearabic.quran.v2`) so it never bloats your progress data.

## Making the Quran library local

The Quran view works offline by design:

1. **Automatic cache** — every surah you open is saved on your device, so it is
   available offline afterwards (the green dot in the list marks saved surahs).
2. **Download all** — fetches and stores all 114 surahs in one go.
3. **Export / Import** — export the cached text to `typearabic-quran.json` and
   import it on another machine or browser.
4. **`quran-local.json`** — put a file with this shape next to `index.html` and
   the library will seed from it even with no network:

   ```json
   {
     "list": [ { "number": 1, "name": "سُورَةُ ٱلْفَاتِحَةِ", "englishName": "Al-Faatiha", "translation": "The Opening", "ayahs": 7, "type": "Meccan" } ],
     "surahs": {
       "1": { "number": 1, "name": "سُورَةُ ٱلْفَاتِحَةِ", "englishName": "Al-Faatiha",
              "ayahs": [ { "n": 1, "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" } ] }
     }
   }
   ```

## Files

| File         | Purpose                                                        |
| ------------ | -------------------------------------------------------------- |
| `index.html` | Markup and layout                                              |
| `styles.css` | Theme, layout, keyboard and animations                         |
| `data.js`    | Keyboard layout, lesson course, word/sentence banks            |
| `app.js`     | Typing engine, mistake tracking, i18n, views                   |

## Keyboard layout reference

Based on the standard Arabic 101 layout:

```
Number row   ذ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠
Top row      ض ص ث ق ف غ ع ه خ ح ج د
Home row     ش س ي ب ل ا ت ن م ك ط
Bottom row   ئ ء ؤ ر لا ى ة و ز ظ
```

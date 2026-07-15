# 🟩 wordle-br

A **Termo**-style word game in Portuguese. Guess the 5-letter **word of the day** in 6 tries; tiles turn 🟩 (right spot), 🟨 (wrong spot), ⬛ (not in word). On-screen + physical keyboard, and **accents are ignored** on input (guess `aviao`, it accepts `avião`).

Vanilla JS + CSS, no dependencies, no backend. The daily word is deterministic from the date, so everyone gets the same puzzle.

## Play
```bash
bunx serve .    # or python -m http.server → open index.html
```

## Layout
- `logic.js` — pure engine (`score` with duplicate-letter handling, `normalize`, `wordForDay`), unit-tested.
- `game.js` — board, keyboard, input.
- `index.html` — layout + styles.

## Dev
```bash
bun test    # scoring incl. accents & repeated letters, win detection, daily-word wrap
```

## Deploy
Static → **GitHub Pages** via `.github/workflows/pages.yml`.

MIT.

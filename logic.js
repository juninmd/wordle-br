// wordle-br core logic — pure, accent-insensitive. No DOM.

/** Lowercase + strip diacritics, so "avião" and "aviao" compare equal. */
export function normalize(w) {
  return w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Score a guess against the answer. Returns 5 states:
 * "correct" (right letter+spot), "present" (right letter, wrong spot),
 * "absent". Duplicate letters are handled with a two-pass count so a guessed
 * letter never claims more slots than the answer actually has.
 */
export function score(guess, answer) {
  const g = normalize(guess).split("");
  const a = normalize(answer).split("");
  const res = new Array(g.length).fill("absent");
  const remaining = {};

  for (let i = 0; i < a.length; i++) {
    if (g[i] === a[i]) res[i] = "correct";
    else remaining[a[i]] = (remaining[a[i]] || 0) + 1;
  }
  for (let i = 0; i < g.length; i++) {
    if (res[i] === "correct") continue;
    if (remaining[g[i]] > 0) {
      res[i] = "present";
      remaining[g[i]]--;
    }
  }
  return res;
}

export function isWin(states) {
  return states.length > 0 && states.every((s) => s === "correct");
}

export function isValidGuess(word, length = 5) {
  return typeof word === "string" && normalize(word).length === length && /^[a-z]+$/.test(normalize(word));
}

/** Deterministic daily word: pick by a day index (stable per day). */
export function wordForDay(words, dayIndex) {
  return words[((dayIndex % words.length) + words.length) % words.length];
}

// Common Portuguese words that are exactly 5 letters once accents are stripped
// (display forms shown to the player; comparison is accent-insensitive).
export const WORDS = [
  "praia", "livro", "verde", "campo", "chuva", "vidro", "papel", "carta", "festa", "porta",
  "torre", "nuvem", "fruta", "peixe", "corpo", "banho", "leite", "porto", "monte", "pedra",
  "canto", "amigo", "manhã", "tarde", "flora", "fauna", "rocha", "praça", "rosto", "dente",
  "dedos", "sinal", "ideia", "poder", "saber", "viver", "criar", "beijo", "sorte", "medos",
  "raiva", "calma", "vento", "terra", "lagoa", "serra", "trigo", "milho", "arroz", "massa",
  "bolos", "docas", "navio", "barco", "remos", "mares", "ondas", "areia", "conta", "banco",
  "moeda", "juros", "lucro", "custo", "preço", "valor", "renda", "carro", "motos", "rodas",
  "freio", "farol", "placa", "verbo", "nomes", "letra", "frase", "texto", "conto", "poema",
  "ritmo", "corte", "roupa", "linha", "cobra", "tigre", "lobos", "porco", "cabra", "avião",
  "prato", "copos", "garfo", "forno", "fogão", "salsa", "molho", "sucos", "sopas", "doces",
].filter((w) => normalize(w).length === 5);

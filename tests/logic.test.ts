import { test, expect } from "bun:test";
import { normalize, score, isWin, isValidGuess, wordForDay, WORDS } from "../logic.js";

test("normalize strips accents and case", () => {
  expect(normalize("Avião")).toBe("aviao");
  expect(normalize("PRAÇA")).toBe("praca");
});

test("score: exact match is all correct", () => {
  expect(score("praia", "praia")).toEqual(["correct", "correct", "correct", "correct", "correct"]);
});

test("score is accent-insensitive", () => {
  expect(score("aviao", "avião")).toEqual(["correct", "correct", "correct", "correct", "correct"]);
});

test("score marks present vs absent", () => {
  // answer "campo", guess "porta": p present(≠pos), o present, r absent, t absent, a present
  const r = score("porta", "campo");
  expect(r[0]).toBe("present"); // p exists in campo, wrong spot
  expect(r[2]).toBe("absent"); // r not in campo
});

test("score handles duplicate guessed letters", () => {
  // answer "porta" has one 'o'; guess "provo" has two 'o'.
  // pos0 p correct, pos1 r correct? porta = p,o,r,t,a; provo = p,r,o,v,o
  // p:correct, r vs o: r present (r in porta), o vs r: o present (one o), v absent, o vs a: absent (o used up)
  const r = score("provo", "porta");
  expect(r[0]).toBe("correct");
  expect(r.filter((s) => s === "present").length).toBe(2); // r and first o
  expect(r[3]).toBe("absent"); // v
  expect(r[4]).toBe("absent"); // second o has no match left
});

test("isWin", () => {
  expect(isWin(["correct", "correct", "correct", "correct", "correct"])).toBe(true);
  expect(isWin(["correct", "present", "correct", "correct", "correct"])).toBe(false);
});

test("isValidGuess enforces length + letters", () => {
  expect(isValidGuess("praia")).toBe(true);
  expect(isValidGuess("avião")).toBe(true); // 5 after normalize
  expect(isValidGuess("abc")).toBe(false);
  expect(isValidGuess("ab1cd")).toBe(false);
});

test("wordForDay is deterministic and wraps", () => {
  expect(wordForDay(WORDS, 0)).toBe(WORDS[0]);
  expect(wordForDay(WORDS, WORDS.length)).toBe(WORDS[0]);
  expect(wordForDay(WORDS, -1)).toBe(WORDS[WORDS.length - 1]);
});

test("every embedded word normalizes to 5 letters", () => {
  for (const w of WORDS) expect(normalize(w).length).toBe(5);
});

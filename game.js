import { score, isWin, isValidGuess, normalize, wordForDay, WORDS } from "./logic.js";

const ROWS = 6;
const LEN = 5;
const answer = wordForDay(WORDS, Math.floor(Date.now() / 86_400_000));

const boardEl = document.getElementById("board");
const msgEl = document.getElementById("msg");
const kbEl = document.getElementById("kb");

let row = 0;
let current = "";
let done = false;
const keyState = {}; // best-known state per letter

function buildBoard() {
  for (let r = 0; r < ROWS; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    rowEl.dataset.row = String(r);
    for (let c = 0; c < LEN; c++) {
      const t = document.createElement("div");
      t.className = "tile";
      rowEl.appendChild(t);
    }
    boardEl.appendChild(rowEl);
  }
}

const KB = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
function buildKeyboard() {
  KB.forEach((line, i) => {
    const kr = document.createElement("div");
    kr.className = "krow";
    if (i === 2) kr.appendChild(makeKey("enter", "wide"));
    for (const ch of line) kr.appendChild(makeKey(ch));
    if (i === 2) kr.appendChild(makeKey("⌫", "wide", "back"));
    kbEl.appendChild(kr);
  });
}
function makeKey(label, extra = "", action) {
  const b = document.createElement("button");
  b.className = "key " + extra;
  b.textContent = label;
  b.dataset.key = action || (label === "enter" ? "enter" : label);
  b.addEventListener("click", () => handle(b.dataset.key));
  return b;
}

function renderCurrent() {
  const tiles = boardEl.children[row].children;
  for (let c = 0; c < LEN; c++) {
    tiles[c].textContent = current[c] || "";
    tiles[c].classList.toggle("filled", !!current[c]);
  }
}

function paintKeyboard() {
  for (const btn of kbEl.querySelectorAll(".key")) {
    const k = btn.dataset.key;
    if (keyState[k]) {
      btn.classList.remove("correct", "present", "absent");
      btn.classList.add(keyState[k]);
    }
  }
}

function submit() {
  if (!isValidGuess(current)) {
    flash("palavra precisa de 5 letras");
    return;
  }
  const states = score(current, answer);
  const tiles = boardEl.children[row].children;
  const guess = normalize(current);
  states.forEach((s, c) => {
    tiles[c].classList.add(s);
    const prev = keyState[guess[c]];
    // upgrade priority: correct > present > absent
    if (s === "correct" || (s === "present" && prev !== "correct") || !prev) keyState[guess[c]] = s;
  });
  paintKeyboard();

  if (isWin(states)) {
    done = true;
    flash("🎉 acertou!");
    return;
  }
  row++;
  current = "";
  if (row >= ROWS) {
    done = true;
    flash("💀 era: " + answer.toUpperCase());
  }
}

function flash(text) {
  msgEl.textContent = text;
}

function handle(key) {
  if (done) return;
  if (key === "enter") return submit();
  if (key === "back") return ((current = current.slice(0, -1)), renderCurrent());
  if (/^[a-z]$/.test(key) && current.length < LEN) {
    current += key;
    renderCurrent();
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handle("enter");
  else if (e.key === "Backspace") handle("back");
  else {
    const k = normalize(e.key);
    if (/^[a-z]$/.test(k)) handle(k);
  }
});

buildBoard();
buildKeyboard();

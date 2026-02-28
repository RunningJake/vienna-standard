/**
 * Dino vs Sea Lion
 * Rules:
 * - ROAR beats CHOMP
 * - CHOMP beats SPLASH
 * - SPLASH beats ROAR
 */

const MOVES = [
  { id: "roar",   label: "ROAR",   beats: "chomp"  },
  { id: "splash", label: "SPLASH", beats: "roar"   },
  { id: "chomp",  label: "CHOMP",  beats: "splash" },
];

const $ = (sel) => document.querySelector(sel);

const els = {
  youWins: $("#youWins"),
  cpuWins: $("#cpuWins"),
  youStreak: $("#youStreak"),
  cpuStreak: $("#cpuStreak"),
  youLast: $("#youLast"),
  cpuLast: $("#cpuLast"),
  readout: $("#readout"),
  buttons: Array.from(document.querySelectorAll(".move")),
  reset: $("#btnReset"),
  youAvatar: $("#youAvatar"),
  cpuAvatar: $("#cpuAvatar"),
};

const state = {
  youWins: 0,
  cpuWins: 0,
  youStreak: 0,
  cpuStreak: 0,
  locked: false,
};

function randChoice(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function outcome(you, cpu){
  if (you.id === cpu.id) return "tie";
  if (you.beats === cpu.id) return "you";
  return "cpu";
}

function setLocked(v){
  state.locked = v;
  els.buttons.forEach(b => b.disabled = v);
}

function setReadout(html){
  els.readout.innerHTML = html;
}

function updateScore(){
  els.youWins.textContent = String(state.youWins);
  els.cpuWins.textContent = String(state.cpuWins);
  els.youStreak.textContent = String(state.youStreak);
  els.cpuStreak.textContent = String(state.cpuStreak);
}

function setLastMoves(you, cpu){
  els.youLast.textContent = you.label;
  els.cpuLast.textContent = cpu.label;
}

function pulse(el){
  el.animate(
    [{ transform:"scale(1)" }, { transform:"scale(1.04)" }, { transform:"scale(1)" }],
    { duration: 240, easing: "ease-out" }
  );
}

function endIfWinner(){
  if (state.youWins >= 3 || state.cpuWins >= 3){
    const youWon = state.youWins > state.cpuWins;
    setLocked(true);
    setReadout(
      youWon
        ? "🏆 <strong>You win the match!</strong> Dino celebrates. Hit Reset for a rematch."
        : "💀 <strong>Computer wins the match!</strong> Sea lion is smug. Hit Reset to try again."
    );
    els.youAvatar.textContent = youWon ? "🦖✨" : "🦖";
    els.cpuAvatar.textContent = youWon ? "🦭" : "🦭✨";
    return true;
  }
  return false;
}

function playRound(youMoveId){
  if (state.locked) return;

  const you = MOVES.find(m => m.id === youMoveId);
  const cpu = randChoice(MOVES);
  const result = outcome(you, cpu);

  setLastMoves(you, cpu);

  if (result === "tie"){
    state.youStreak = 0;
    state.cpuStreak = 0;
    setReadout(`It’s a <strong>tie</strong>. You both used <strong>${you.label}</strong>.`);
  } else if (result === "you"){
    state.youWins += 1;
    state.youStreak += 1;
    state.cpuStreak = 0;
    setReadout(`You used <strong>${you.label}</strong>. Computer used <strong>${cpu.label}</strong>. <strong>You win</strong> this round!`);
    pulse(els.youAvatar);
  } else {
    state.cpuWins += 1;
    state.cpuStreak += 1;
    state.youStreak = 0;
    setReadout(`You used <strong>${you.label}</strong>. Computer used <strong>${cpu.label}</strong>. <strong>You lose</strong> this round!`);
    pulse(els.cpuAvatar);
  }

  updateScore();
  endIfWinner();
}

function reset(){
  state.youWins = 0;
  state.cpuWins = 0;
  state.youStreak = 0;
  state.cpuStreak = 0;
  setLocked(false);
  updateScore();
  els.youAvatar.textContent = "🦖";
  els.cpuAvatar.textContent = "🦭";
  els.youLast.textContent = "—";
  els.cpuLast.textContent = "—";
  setReadout("Make your move.");
}

els.buttons.forEach(btn => btn.addEventListener("click", () => playRound(btn.dataset.move)));
els.reset.addEventListener("click", reset);

updateScore();

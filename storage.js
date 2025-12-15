const STORAGE_KEY = "volley-record-state";

let gameState = {
  meta: { date:"", teamA:"", teamB:"", opponentScore:0 },
  players: []
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  gameState = JSON.parse(raw);
  return true;
}

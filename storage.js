const STORAGE_KEY = "volley-record-state";

let gameState = {
  meta: { date:"", teamA:"", teamB:"", opponentScore:0 },
  players: []
};

const SKILLS = [
  { label: "發球", count: 3 },
  { label: "一傳", count: 2 },
  { label: "攻擊", count: 3 },
  { label: "攔網", count: 3 },
  { label: "防守", count: 2 },
  { label: "吊球", count: 3 },
  { label: "小球", count: 2 },
  { label: "修正", count: 2 }
];


function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  gameState = JSON.parse(raw);
  return true;
}

function createDefaultState() {
  const today = new Date().toISOString().split("T")[0];

  return {
    meta: {
      date: today,
      teamA: "",
      teamB: "",
      opponentScore: 0
    },
    players: Array.from({ length: MIN_PLAYERS }, () => ({
      number: "",
      cells: Array(CELL_COUNT).fill(0)
    }))
  };
}

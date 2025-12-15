const CELL_COUNT = 20;
const MIN_PLAYERS = 7;

const playerBody = document.getElementById("players");
const addBtn = document.getElementById("addPlayer");
const removeBtn = document.getElementById("removePlayer");

/* ========= 工具 ========= */

function getPlayerCount() {
  return gameState.players.length;
}

function applyZebra() {
  Array.from(playerBody.children).forEach((tr, i) => {
    tr.classList.toggle("gray", i % 2 === 1);
  });
}

function updateRemoveButtonState() {
  removeBtn.disabled = getPlayerCount() <= MIN_PLAYERS;
}

/* ========= Cell Handler（state-based） ========= */

function attachCellHandler(td, playerData, cellIndex) {
  let startX = 0, startY = 0;
  let moved = false;
  let pressTimer = null;
  let longPressed = false;
  const MOVE_THRESHOLD = 10;

  function update(delta) {
    let v = playerData.cells[cellIndex];
    v = Math.max(0, v + delta);
    playerData.cells[cellIndex] = v;

    td.dataset.value = v;
    td.textContent = v === 0 ? "" : v;
    saveState(); // ⭐ 關鍵
  }

  /* touch */
  td.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    moved = false;
    longPressed = false;

    pressTimer = setTimeout(() => {
      if (!moved) {
        longPressed = true;
        update(-1);
        navigator.vibrate?.(10);
      }
    }, 450);
  }, { passive: true });

  td.addEventListener("touchmove", e => {
    const t = e.touches[0];
    if (
      Math.abs(t.clientX - startX) > MOVE_THRESHOLD ||
      Math.abs(t.clientY - startY) > MOVE_THRESHOLD
    ) {
      moved = true;
      clearTimeout(pressTimer);
    }
  }, { passive: true });

  td.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
    if (!moved && !longPressed) update(+1);
  });

  /* mouse */
  td.addEventListener("mousedown", () => {
    longPressed = false;
    pressTimer = setTimeout(() => {
      longPressed = true;
      update(-1);
    }, 450);
  });

  td.addEventListener("mouseup", () => {
    clearTimeout(pressTimer);
    if (!longPressed) update(+1);
  });

  td.addEventListener("mouseleave", () => clearTimeout(pressTimer));
}

/* ========= 建立一列（完全由 state 決定） ========= */

function createPlayerRow(playerData) {
  const tr = document.createElement("tr");

  /* 背號 */
  const numTd = document.createElement("td");
  numTd.className = "num";

  const input = document.createElement("input");
  input.type = "number";
  input.inputMode = "numeric";
  input.value = playerData.number ?? "";

  input.addEventListener("input", () => {
    playerData.number = input.value;
    saveState();
  });

  numTd.appendChild(input);
  tr.appendChild(numTd);

  /* 技能格 */
  playerData.cells.forEach((value, i) => {
    const td = document.createElement("td");
    td.classList.add("cell");
    td.dataset.value = value;
    td.textContent = value === 0 ? "" : value;

    if ([0, 3, 5, 8, 11, 13, 16, 18].includes(i)) td.classList.add("L");
    if ([2, 4, 7, 10, 12, 15, 17, 19].includes(i)) td.classList.add("R");

    attachCellHandler(td, playerData, i);
    tr.appendChild(td);
  });

  return tr;
}

/* ========= 操作 ========= */

function addPlayer() {
  gameState.players.push({
    number: "",
    cells: Array(CELL_COUNT).fill(0)
  });

  saveState();
  renderTable();
}

function removePlayer() {
  if (gameState.players.length > MIN_PLAYERS) {
    gameState.players.pop();
    saveState();
    renderTable();
  }
}

/* ========= 重建整張表 ========= */

function renderTable() {
  playerBody.innerHTML = "";
  gameState.players.forEach(p => {
    playerBody.appendChild(createPlayerRow(p));
  });
  applyZebra();
  updateRemoveButtonState();
}

/* ========= 初始化 ========= */

function initRecordTable() {
  renderTable(); // 只負責畫表，不碰 storage
}

/* ========= 綁定 ========= */

addBtn.addEventListener("click", addPlayer);
removeBtn.addEventListener("click", removePlayer);
let currentPlayerIndex = 0;

function renderPage() {
  const tbody = document.getElementById("recordPageBody");
  tbody.innerHTML = "";

  const player = gameState.players[currentPlayerIndex];
  if (!player) return;

  let cellIndex = 0;

  SKILLS.forEach(skill => {
    const tr = document.createElement("tr");

    /* 左邊：技能名稱 */
    const labelTd = document.createElement("td");
    labelTd.className = "skill-label";
    labelTd.textContent = skill.label;
    tr.appendChild(labelTd);

    /* 右邊：該技能的格子（橫排） */
    const cellsTd = document.createElement("td");
    cellsTd.className = "skill-cells";

    for (let i = 0; i < skill.count; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.value = player.cells[cellIndex];
      cell.textContent = player.cells[cellIndex] || "";

      attachCellHandler(cell, player, cellIndex);
      cellsTd.appendChild(cell);

      cellIndex++;
    }

    tr.appendChild(cellsTd);
    tbody.appendChild(tr);
  });
}


function initPlayerSelect() {
  const container = document.getElementById("players-m");
  if (!container) return;

  container.innerHTML = "";

  gameState.players.forEach((player, index) => {
    const btn = document.createElement("button");

    // 顯示背號（沒有就空白）
    btn.textContent = player.number || "";
    btn.classList.add("player-btn");

    if (index === currentPlayerIndex) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPlayerIndex = index;
      updatePlayerSelectActive();
      onPlayerChange(); // ⭐ 切換球員後要做的事
    });

    container.appendChild(btn);
  });
}


function updatePlayerSelectActive() {
  const buttons = document.querySelectorAll(".player-select .player-btn");
  buttons.forEach((btn, i) => {
    btn.classList.toggle("active", i === currentPlayerIndex);
  });
}


function updatePlayerSelectLabels() {
  const buttons = document.querySelectorAll(".player-select .player-btn");

  buttons.forEach((btn, i) => {
    btn.textContent = gameState.players[i]?.number || "";
  });
}


function onPlayerChange() {
  renderPage();

  const input = document.getElementById("playerNumberInput");
  if (input) {
    input.value = gameState.players[currentPlayerIndex]?.number || "";
  }
}


function addPlayer() {
  gameState.players.push({
    number: "",
    cells: Array(CELL_COUNT).fill(0)
  });

  // 切到新球員
  currentPlayerIndex = gameState.players.length - 1;

  saveState();

  initPlayerSelect();
  updatePlayerNumberInput();
  renderPage();
  updateRemoveButtonState();
}


// function removePlayer() {
//   if (gameState.players.length <= MIN_PLAYERS) return;

//   gameState.players.splice(currentPlayerIndex, 1);

//   // 修正 index（避免超出）
//   if (currentPlayerIndex >= gameState.players.length) {
//     currentPlayerIndex = gameState.players.length - 1;
//   }
//   if (currentPlayerIndex < 0) currentPlayerIndex = 0;

//   saveState();

//   initPlayerSelect();
//   updatePlayerNumberInput();
//   renderPage();
//   updateRemoveButtonState();
// }

function removePlayer() {
  if (gameState.players.length <= MIN_PLAYERS) return;

  // 永遠刪最後一位
  gameState.players.pop();

  // 如果目前 index 超出，拉回最後一位
  if (currentPlayerIndex >= gameState.players.length) {
    currentPlayerIndex = gameState.players.length - 1;
  }

  saveState();

  initPlayerSelect();
  updatePlayerNumberInput();
  renderPage();
  updateRemoveButtonState();
}


function updateRemoveButtonState() {
  const btn = document.getElementById("removePlayer-m");
  if (!btn) return;

  btn.disabled = gameState.players.length <= MIN_PLAYERS;
}

function updatePlayerNumberInput() {
  const input = document.getElementById("playerNumberInput");
  if (!input) return;

  input.value = gameState.players[currentPlayerIndex]?.number || "";
}

document
  .getElementById("addPlayer-m")
  .addEventListener("click", addPlayer);

document
  .getElementById("removePlayer-m")
  .addEventListener("click", removePlayer);

let currentPlayerIndex = 0;

const RESULT_COLUMNS = ["✔", "○", "✕"];

const SKILLS = [
  { label: "發球", cols: [0, 1, 2] }, // ✔ ○ ✕
  { label: "一傳", cols: [1, 2] },    // ○ ✕
  { label: "攻擊", cols: [0, 1, 2] },
  { label: "攔網", cols: [0, 1, 2] },
  { label: "防守", cols: [1, 2] },
  { label: "吊球", cols: [0, 1, 2] },
  { label: "小球", cols: [1, 2] },
  { label: "修正", cols: [1, 2] }
];


function renderPage() {
  const tbody = document.getElementById("recordPageBody");
  tbody.innerHTML = "";

  const player = gameState.players[currentPlayerIndex];
  if (!player) return;

  let cellIndex = 0;

  /* ===== Header Row ===== */
  const headerTr = document.createElement("tr");

  // 左上角空白
  headerTr.appendChild(document.createElement("th"));

  RESULT_COLUMNS.forEach(symbol => {
    const th = document.createElement("th");
    th.className = "result-header";
    th.textContent = symbol;
    headerTr.appendChild(th);
  });

  tbody.appendChild(headerTr);

  /* ===== Skill Rows ===== */
  SKILLS.forEach(skill => {
    const tr = document.createElement("tr");

    /* 技能名稱 */
    const labelTd = document.createElement("td");
    labelTd.className = "skill-label";
    labelTd.textContent = skill.label;
    tr.appendChild(labelTd);

    /* 三個結果欄位 */
    RESULT_COLUMNS.forEach((symbol, colIndex) => {
      const td = document.createElement("td");

      if (skill.cols.includes(colIndex)) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const value = player.cells[cellIndex];
        cell.dataset.value = value;
        cell.textContent = value === 0 ? "" : value;


        attachCellHandlerMobile(cell, player, cellIndex);

        td.appendChild(cell);
        cellIndex++;
      } else {
        // 不存在的欄位，留空
        td.className = "empty";
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}


function attachCellHandlerMobile(cell, player, index) {
  if (cell._mobileHandlerAttached) return;
  cell._mobileHandlerAttached = true;

  let startX = 0;
  let startY = 0;
  let moved = false;
  let longPressed = false;
  let pressTimer = null;

  const MOVE_THRESHOLD = 10;
  const LONG_PRESS_MS = 450;

  function update(delta) {
    let v = Number(player.cells[index] || 0);
    v = Math.max(0, v + delta);
    player.cells[index] = v;

    saveState();
    renderPage(); // ⭐ 關鍵：重新畫整個 page
  }

  cell.addEventListener(
    "touchstart",
    (e) => {
      // e.preventDefault();

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
      }, LONG_PRESS_MS);
    },
    { passive: false }
  );

  cell.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (
      Math.abs(t.clientX - startX) > MOVE_THRESHOLD ||
      Math.abs(t.clientY - startY) > MOVE_THRESHOLD
    ) {
      moved = true;
      clearTimeout(pressTimer);
    }
  });

  cell.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
    if (!moved && !longPressed) {
      update(+1);
    }
  });
}


function initPlayerSelect() {
  const container = document.querySelector(".player-select");
  console.log("player-select:", container);
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

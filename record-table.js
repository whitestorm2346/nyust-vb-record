const CELL_COUNT = 20; 
// 發球3 + 一傳2 + 攻擊3 + 攔網3 + 防守2 + 吊球3 + 小球2 + 修正2 = 20

const MIN_PLAYERS = 7;

const playerBody = document.getElementById("players");
const addBtn = document.getElementById("addPlayer");
const removeBtn = document.getElementById("removePlayer");

/* 取得目前球員列數（要抓 tr，不是 cell） */
function getPlayerCount() {
  return playerBody.querySelectorAll("tr").length;
}

/* 重新套用灰白相間（新增/刪除後都要跑一次） */
function applyZebra() {
  const rows = playerBody.querySelectorAll("tr");
  rows.forEach((tr, i) => {
    tr.classList.toggle("gray", i % 2 === 1);
  });
}

/* 更新「減少球員」按鈕狀態 */
function updateRemoveButtonState() {
  removeBtn.disabled = getPlayerCount() <= MIN_PLAYERS;
}

/* 建立一個球員 row */
function createPlayerRow(index) {
  const tr = document.createElement("tr");

  /* === 背號欄（可輸入） === */
  const numTd = document.createElement("td");
  numTd.className = "num";

  const input = document.createElement("input");
  input.type = "number";
  input.inputMode = "numeric";
  // ✅ 不要用 inline style，交給 CSS（你之前也希望去掉框線）
  // input.style.width = "100%";
  // input.style.border = "none";
  // input.style.textAlign = "center";

  numTd.appendChild(input);
  tr.appendChild(numTd);

  /* === 技能格子 === */
  for (let i = 0; i < CELL_COUNT; i++) {
    const td = document.createElement("td");
    td.classList.add("cell");
    td.dataset.value = "0";
    td.textContent = "";

    // 左右粗線
    if ([0, 3, 5, 8, 11, 13, 16, 18].includes(i)) td.classList.add("L");
    if ([2, 4, 7, 10, 12, 15, 17, 19].includes(i)) td.classList.add("R");

    attachCellHandler(td);
    tr.appendChild(td);
  }

  return tr;
}

/* 新增球員（加一整列 tr） */
function addPlayer() {
  const index = getPlayerCount(); // 0-based
  const row = createPlayerRow(index);
  playerBody.appendChild(row);

  applyZebra();
  updateRemoveButtonState();
}

/* 減少球員（刪除最後一整列 tr） */
function removePlayer() {
  const rows = playerBody.querySelectorAll("tr");
  if (rows.length > MIN_PLAYERS) {
    rows[rows.length - 1].remove();
  }

  applyZebra();
  updateRemoveButtonState();
}

/* 初始化：預設 MIN_PLAYERS 人 */
function initPlayers() {
  for (let i = 0; i < MIN_PLAYERS; i++) addPlayer();
  applyZebra();
  updateRemoveButtonState();
}

/* 綁定事件 */
addBtn.addEventListener("click", addPlayer);
removeBtn.addEventListener("click", removePlayer);

/* 啟動 */
initPlayers();


function attachCellHandler(td) {
  let startX = 0;
  let startY = 0;
  let moved = false;
  let pressTimer = null;
  let longPressed = false;

  const MOVE_THRESHOLD = 10; // px

  function update(delta) {
    let v = Number(td.dataset.value || 0);
    v = Math.max(0, v + delta);
    td.dataset.value = v;
    td.textContent = v === 0 ? "" : v;
  }

  /* ===== 手機 touch ===== */
  td.addEventListener("touchstart", (e) => {
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

  td.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX);
    const dy = Math.abs(t.clientY - startY);

    if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
      moved = true;
      clearTimeout(pressTimer);
    }
  }, { passive: true });

  td.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
    if (!moved && !longPressed) {
      update(+1);
    }
  });

  /* ===== 桌機 mouse ===== */
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

  td.addEventListener("mouseleave", () => {
    clearTimeout(pressTimer);
    longPressed = false;
  });
}

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
  let pressTimer = null;
  let longPressed = false;

  const update = (delta) => {
    let v = Number(td.dataset.value);
    v = Math.max(0, v + delta);
    td.dataset.value = v;
    td.textContent = v === 0 ? "" : v;
  };

  // === 按下 ===
  const startPress = (e) => {
    longPressed = false;
    pressTimer = setTimeout(() => {
      longPressed = true;
      update(-1); // 長按 -1
      if (navigator.vibrate) navigator.vibrate(10);
    }, 450);
    e.preventDefault();
  };

  // === 放開 ===
  const endPress = (e) => {
    if (pressTimer) clearTimeout(pressTimer);
    if (!longPressed) update(+1); // 短按 +1
    e.preventDefault();
  };

  // 手機
  td.addEventListener("touchstart", startPress, { passive: false });
  td.addEventListener("touchend", endPress, { passive: false });

  // 桌機
  td.addEventListener("mousedown", startPress);
  td.addEventListener("mouseup", endPress);
  td.addEventListener("mouseleave", () => {
    if (pressTimer) clearTimeout(pressTimer);
  });
}

const MOBILE_MAX_WIDTH = 767;

function detectViewMode() {
  return window.innerWidth <= MOBILE_MAX_WIDTH
    ? "mobile"
    : "desktop";
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 DOMContentLoaded fired");
    
  /* ① 先載入 localStorage（唯一一次） */
  const hasData = loadState();
  applyViewMode();

  /* ② 確保 players 一定存在（但不動既有資料） */
  if (!hasData || !Array.isArray(gameState.players)) {
    gameState.players = [];
  }

  if (gameState.players.length === 0) {
    for (let i = 0; i < MIN_PLAYERS; i++) {
      gameState.players.push({
        number: "",
        cells: Array(CELL_COUNT).fill(0)
      });
    }
    saveState();
  }

  /* ③ 只做「state → UI」的初始化 render（不再 save） */
  initGameInfo();   // 填上 Date / 隊伍 / 對手失分

  if(detectViewMode() === "desktop"){
    renderTable();    // 畫出球員表格
  }
  else if(detectViewMode() === "mobile"){
    initPlayerSelect();
    initPlayerNumberInput();
    renderPage();
  }
});


function clearRecord() {
  if (!confirm("確定要清空本場所有記錄嗎？")) return;

  gameState = createDefaultState();
  saveState();

  // 重新 render（只畫，不存）
  initGameInfo();
  
  if(detectViewMode() === "desktop"){
    renderTable();    // 畫出球員表格
  }
  else if(detectViewMode() === "mobile"){
    currentPlayerIndex = 0;      // 回到第一位
    initPlayerSelect();          // 重建背號按鈕
    updatePlayerNumberInput();   // 同步背號輸入框
    renderPage();                // ⭐ 重新畫中間表格
    updateRemoveButtonState();   // 同步刪除按鈕
  }
}

function initPlayerNumberInput() {
  const input = document.getElementById("playerNumberInput");
  if (!input) return;

  // 初始顯示目前球員背號
  const player = gameState.players[currentPlayerIndex];
  input.value = player?.number || "";

  // 輸入時同步 state
  input.addEventListener("input", () => {
    const player = gameState.players[currentPlayerIndex];
    if (!player) return;

    player.number = input.value;
    saveState();

    // ⭐ 同步更新 footer 的背號按鈕
    updatePlayerSelectLabels();
  });
}


document.getElementById("clearRecord").addEventListener("click", clearRecord);
document.getElementById("clearRecord-m").addEventListener("click", clearRecord);


const mobileQuery = window.matchMedia("(max-width: 767px)");

function applyViewMode() {
  if (mobileQuery.matches) {
    // 手機直立 / 小螢幕
    renderPage();
    initPlayerSelect();
  } else {
    // 橫向 / 平板 / 桌機
    renderTable();
  }
}

mobileQuery.addEventListener("change", () => {
  // 給瀏覽器一點時間完成 layout（很重要）
  setTimeout(() => {
    applyViewMode();
  }, 0);
});

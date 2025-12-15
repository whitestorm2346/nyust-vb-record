console.log("🔥 main.js loaded");


document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 DOMContentLoaded fired");
    
  /* ① 先載入 localStorage（唯一一次） */
  const hasData = loadState();

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
  renderTable();    // 畫出球員表格
});

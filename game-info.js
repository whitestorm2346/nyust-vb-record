/* =========================
   Game Info (state-based)
   ========================= */

function initGameInfo() {
  if (detectViewMode() === "desktop"){
    /* === Date === */
    const dateInput = document.getElementById("gameDate");
    dateInput.value = gameState.meta.date || "";
  
    dateInput.addEventListener("change", () => {
      gameState.meta.date = dateInput.value;
      saveState();
    });
  
    dateInput.addEventListener("click", () => {
      dateInput.showPicker?.();
    });
  
    /* === 隊伍名稱 === */
    const teamAInput = document.getElementById("teamA");
    const teamBInput = document.getElementById("teamB");
  
    teamAInput.value = gameState.meta.teamA || "";
    teamBInput.value = gameState.meta.teamB || "";
  
    teamAInput.addEventListener("input", () => {
      gameState.meta.teamA = teamAInput.value;
      saveState();
    });
  
    teamBInput.addEventListener("input", () => {
      gameState.meta.teamB = teamBInput.value;
      saveState();
    });
  
    /* === 對手失分 === */
    const scoreEl = document.getElementById("oppScore");
    scoreEl.textContent = gameState.meta.opponentScore || 0;

    const oppScoreAddBtn = document.getElementById("oppScoreAdd").addEventListener("click", () => {
      gameState.meta.opponentScore =
        Math.max(0, gameState.meta.opponentScore + 1);
      
      scoreEl.textContent = gameState.meta.opponentScore;
      saveState();
    })

    const oppScoreMinusBtn = document.getElementById("oppScoreMinus").addEventListener("click", () => {
      gameState.meta.opponentScore =
        Math.max(0, gameState.meta.opponentScore - 1);
      
      scoreEl.textContent = gameState.meta.opponentScore;
      saveState();
    })
  }
  else if (detectViewMode() === "mobile"){
    /* === Date === */
    const dateInput = document.getElementById("gameDate-m");
    dateInput.value = gameState.meta.date || "";
  
    dateInput.addEventListener("change", () => {
      gameState.meta.date = dateInput.value;
      saveState();
    });
  
    dateInput.addEventListener("click", () => {
      dateInput.showPicker?.();
    });
  
    /* === 隊伍名稱 === */
    const teamAInput = document.getElementById("teamA-m");
    const teamBInput = document.getElementById("teamB-m");
  
    teamAInput.value = gameState.meta.teamA || "";
    teamBInput.value = gameState.meta.teamB || "";
  
    teamAInput.addEventListener("input", () => {
      gameState.meta.teamA = teamAInput.value;
      saveState();
    });
  
    teamBInput.addEventListener("input", () => {
      gameState.meta.teamB = teamBInput.value;
      saveState();
    });
  
    /* === 對手失分 === */
    const scoreEl = document.getElementById("oppScore-m");
    scoreEl.textContent = gameState.meta.opponentScore || 0;

    const oppScoreAddBtn = document.getElementById("oppScoreAdd-m").addEventListener("click", () => {
      gameState.meta.opponentScore =
        Math.max(0, gameState.meta.opponentScore + 1);
      
      scoreEl.textContent = gameState.meta.opponentScore;
      saveState();
    })

    const oppScoreMinusBtn = document.getElementById("oppScoreMinus-m").addEventListener("click", () => {
      gameState.meta.opponentScore =
        Math.max(0, gameState.meta.opponentScore - 1);
      
      scoreEl.textContent = gameState.meta.opponentScore;
      saveState();
    })
  }
}

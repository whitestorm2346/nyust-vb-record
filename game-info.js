/* =========================
   Game Info (state-based)
   ========================= */

function initGameInfo() {
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

  document.querySelectorAll(".score .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const delta = Number(btn.dataset.delta);
      gameState.meta.opponentScore =
        Math.max(0, gameState.meta.opponentScore + delta);

      scoreEl.textContent = gameState.meta.opponentScore;
      saveState();
    });
  });
}

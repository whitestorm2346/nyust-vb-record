let oppScore = 0;
const scoreEl = document.getElementById("oppScore");

document.querySelectorAll(".score .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    oppScore += Number(btn.dataset.delta);
    if (oppScore < 0) oppScore = 0;
    scoreEl.textContent = oppScore;
  });
});

const dateInput = document.getElementById("gameDate");

const today = new Date();
dateInput.value = today.toISOString().split("T")[0];

dateInput.addEventListener("click", () => {
  dateInput.showPicker();
});
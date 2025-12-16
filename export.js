/* =========================
   Export Table (Landscape)
   ========================= */

/*
  依賴：
  - gameState.players
  - gameState.meta（date, teamA, teamB, opponentScore）
*/

const EXPORT_WIDTH = 1400;
const EXPORT_PADDING_X = 32 * 2; // 左右 padding


const EXPORT_SKILLS = [
  { label: "發球", cols: [0, 1, 2] }, // ✓ ○ ✕
  { label: "一傳", cols: [1, 2] },    // ○ ✕
  { label: "攻擊", cols: [0, 1, 2] },
  { label: "攔網", cols: [0, 1, 2] },
  { label: "防守", cols: [1, 2] },
  { label: "吊球", cols: [0, 1, 2] },
  { label: "小球", cols: [1, 2] },
  { label: "修正", cols: [1, 2] }
];

// 用 cols 轉符號（0=✓,1=○,2=✕）
function colToSymbol(c) {
  if (c === 0) return "✓";  // 用 ✓ 比 ✔ 更不容易缺字
  if (c === 1) return "○";
  return "✕";
}

/* 建立隱藏匯出容器（只建立一次） */
function ensureExportRoot() {
  let root = document.getElementById("exportRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "exportRoot";
    root.style.position = "fixed";
    root.style.left = "-9999px";
    root.style.top = "0";
    root.style.background = "#e9f7ef";

    // ⭐ 新增這裡
    root.style.padding = "24px 32px";
    root.style.boxSizing = "border-box";
    root.style.width = EXPORT_WIDTH + "px"; // ⭐ 關鍵


    document.body.appendChild(root);
  }
  return root;
}


/* 渲染橫向完整表格（照桌機版結構） */
function renderExportTable() {
  const root = ensureExportRoot();
  root.innerHTML = "";

  /* ===== 匯出用 Game Info（flex） ===== */
const info = document.createElement("div");
info.style.display = "flex";
info.style.justifyContent = "space-around"; // ⭐ 重點
info.style.alignItems = "center";
info.style.fontSize = "18px";
info.style.fontWeight = "600";
info.style.marginBottom = "16px";
info.style.width = "100%"; // ⭐ 跟表格同寬
info.style.boxSizing = "border-box";

/* 日期 */
const dateDiv = document.createElement("div");
dateDiv.textContent = gameState.meta.date || "";
info.appendChild(dateDiv);

/* 誰打誰 */
const teamDiv = document.createElement("div");
teamDiv.textContent =
  `${gameState.meta.teamA || ""} vs ${gameState.meta.teamB || ""}`;
info.appendChild(teamDiv);

/* 對手失分 */
const scoreDiv = document.createElement("div");
scoreDiv.textContent =
  `對手失分：${gameState.meta.opponentScore || 0}`;
info.appendChild(scoreDiv);

root.appendChild(info);


  /* ===== 表格 ===== */
  const table = document.createElement("table");

    table.style.borderCollapse = "collapse";
    table.style.tableLayout = "fixed";
    table.style.width = "100%";
    table.style.background = "#e9f7ef";

  /* ===== thead ===== */
  const thead = document.createElement("thead");

// 第一列：技能名稱 + colSpan
const tr1 = document.createElement("tr");

// 背號
const thNum = document.createElement("th");
thNum.textContent = "背號";
thNum.rowSpan = 2;
thNum.style.border = "2px solid #000";
thNum.style.width = "60px";
thNum.style.textAlign = "center";
tr1.appendChild(thNum);

// 技能名稱
EXPORT_SKILLS.forEach(skill => {
  const th = document.createElement("th");
  th.textContent = skill.label;
  th.colSpan = skill.cols.length;              // ✅ 這裡一定正確
  th.style.border = "2px solid #000";
  th.style.textAlign = "center";
  tr1.appendChild(th);
});

thead.appendChild(tr1);

// 第二列：✓ ○ ✕（每一格都 colSpan=1）
const tr2 = document.createElement("tr");
EXPORT_SKILLS.forEach(skill => {
  skill.cols.forEach(c => {
    const th = document.createElement("th");
    th.textContent = colToSymbol(c);           // ✅ 會出現 ✓
    th.style.border = "1px solid #000";
    th.style.width = "36px";
    th.style.height = "36px";
    th.style.textAlign = "center";
    tr2.appendChild(th);
  });
});

thead.appendChild(tr2);
table.appendChild(thead);


  /* ===== tbody ===== */
  const tbody = document.createElement("tbody");

gameState.players.forEach((player, rowIndex) => {
  const tr = document.createElement("tr");
  tr.style.background = rowIndex % 2 ? "#d8eee0" : "#edf9f2";

  // 背號
  const tdNum = document.createElement("td");
  tdNum.textContent = player.number || "";
  tdNum.style.border = "1px solid #000";
  tdNum.style.width = "60px";
  tdNum.style.height = "36px";
  tdNum.style.lineHeight = "36px";
  tdNum.style.textAlign = "center";
  tr.appendChild(tdNum);

  // 技能格（照匯出規格依序塞）
  let idx = 0;
  EXPORT_SKILLS.forEach(skill => {
    for (let k = 0; k < skill.cols.length; k++) {
      const v = player.cells[idx++] || 0;

      const td = document.createElement("td");
      td.textContent = v === 0 ? "" : v;
      td.style.border = "1px solid #000";
      td.style.width = "36px";
      td.style.height = "36px";
      td.style.lineHeight = "36px";
      td.style.textAlign = "center";
      tr.appendChild(td);
    }
  });

  tbody.appendChild(tr);
});

table.appendChild(tbody);

  root.appendChild(table);
}

/* 匯出成 PNG */
async function exportRecordAsImage() {
  renderExportTable();

  const root = document.getElementById("exportRoot");

  const canvas = await html2canvas(root, {
    scale: 2,
    backgroundColor: "#e9f7ef",
    width: EXPORT_WIDTH,
    windowWidth: EXPORT_WIDTH
  });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "比賽記錄.png";
  link.click();
}

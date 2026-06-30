function feeYr(dir) { feeY += dir; renderFee(); }
function feeGkey(did, mi) { return `${did}-${feeY}-${mi}`; }
function feeStatus(did, mi) { return D.fees[feeGkey(did, mi)] || "pendiente"; }

function feeToggle(did, mi) {
  const k = feeGkey(did, mi), c = feeStatus(did, mi);
  const n = c === "pendiente" ? "pagado" : c === "pagado" ? "exonerado" : "pendiente";
  D.fees[k] = n; save(); renderFee();
}

function sIco(s) { return s === "pagado" ? "✅" : s === "exonerado" ? "⭕" : "❌"; }
function sClr(s) { return s === "pagado" ? "var(--green)" : s === "exonerado" ? "var(--orange)" : "var(--red)"; }

function renderFee() {
  document.getElementById("fee-title").textContent = "💰 Mensualidades " + feeY;
  const dancers = D.dancers.filter(d => ["bailarín","bailarina","director/a"].includes(d.rol));
  const monto = D.montoMensual || 5000;
  const paid = dancers.reduce((a, d) => a + MESES.filter((_, i) => feeStatus(d.id, i) === "pagado").length, 0);
  const tot = dancers.length * 12;
  const pct = tot > 0 ? Math.round(paid / tot * 100) : 0;
  const hoy2 = new Date();
  let sh = `<div class="stat-card"><div class="stat-num gold">${pct}%</div><div class="stat-lbl">Pagos completados</div></div>`;
  sh += `<div class="stat-card" style="border-color:rgba(76,175,80,.25)"><div class="stat-num" style="color:var(--green)">₡${(paid * monto).toLocaleString()}</div><div class="stat-lbl">Ingresos del año</div></div>`;
  sh += `<div class="stat-card">
    <div style="display:flex;align-items:center;gap:6px">
      <div style="flex:1;text-align:center"><div class="stat-num gold">₡${monto.toLocaleString()}</div><div class="stat-lbl">Monto mensual</div></div>
      <button onclick="editMonto()" style="background:transparent;border:none;color:var(--goldD);cursor:pointer;font-size:.9rem">✏️</button>
    </div>
  </div>`;
  document.getElementById("fee-stats").innerHTML = sh;
  if (!dancers.length) {
    document.getElementById("fee-table").innerHTML = `<p class="txt-dim">Agrega bailarines (rol: bailarín/a o director/a) para ver mensualidades.</p>`;
    return;
  }
  let th = `<tr><th class="name-col">BAILARÍN</th>`;
  MESES.forEach((m, i) => {
    const isCur = i === hoy2.getMonth() && feeY === hoy2.getFullYear();
    th += `<th style="${isCur ? "color:var(--gold)" : ""}">${m.slice(0, 3).toUpperCase()}</th>`;
  });
  th += `<th>TOTAL</th></tr>`;
  let tb = "";
  dancers.forEach((d, di) => {
    const pag = MESES.filter((_, i) => feeStatus(d.id, i) === "pagado").length;
    const bg = di % 2 === 0 ? "var(--card)" : "#141002";
    let row = `<tr style="background:${bg}"><td class="name-cell" style="background:${bg}">${d.nombre}</td>`;
    MESES.forEach((_, mi) => {
      const s = feeStatus(d.id, mi);
      const isCur = mi === hoy2.getMonth() && feeY === hoy2.getFullYear();
      row += `<td class="fee-cell" style="${isCur ? `background:${sClr(s)}0e` : ""}" onclick="feeToggle(${d.id},${mi})" title="${s}">${sIco(s)}</td>`;
    });
    const bc = pag === 12 ? "rgba(76,175,80,.2)" : pag > 6 ? "rgba(255,152,0,.2)" : "rgba(229,57,53,.2)";
    const tc = pag === 12 ? "var(--green)" : pag > 6 ? "var(--orange)" : "var(--red)";
    row += `<td><span class="total-badge" style="background:${bc};color:${tc}">${pag}/12</span></td></tr>`;
    tb += row;
  });
  document.getElementById("fee-table").innerHTML = `<table><thead>${th}</thead><tbody>${tb}</tbody></table>`;
}

function editMonto() {
  const v = prompt("Monto mensual (₡):", D.montoMensual || 5000);
  if (v !== null && !isNaN(Number(v)) && Number(v) > 0) { D.montoMensual = Number(v); save(); renderFee(); }
}

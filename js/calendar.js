function calPrev() { if (calM === 0) { calM = 11; calY--; } else calM--; renderCal(); }
function calNext() { if (calM === 11) { calM = 0; calY++; } else calM++; renderCal(); }
function calToday() { calY = new Date().getFullYear(); calM = new Date().getMonth(); renderCal(); }
function gkey(y, m, d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

function renderCal() {
  document.getElementById("cal-title").textContent = MESES[calM] + " " + calY;
  const dim = new Date(calY, calM + 1, 0).getDate();
  const fd = new Date(calY, calM, 1).getDay();
  let html = "";
  for (let i = 0; i < fd; i++) html += `<div class="cal-cell" style="cursor:default"></div>`;
  for (let d = 1; d <= dim; d++) {
    const k = gkey(calY, calM, d);
    const evs = D.events[k] || [];
    const isT = k === todayKey;
    let chips = "";
    evs.slice(0, 2).forEach(ev => {
      chips += `<div class="ev-chip ${ev.tipo}">${ev.hora} ${ev.desc}</div>`;
    });
    if (evs.length > 2) chips += `<div style="font-size:.6rem;color:var(--goldD)">+${evs.length - 2} más</div>`;
    html += `<div class="cal-cell${isT ? " today" : ""}" onclick="openCalModal('${k}',${d})">
      <div class="day-num">${d}</div>${chips}
    </div>`;
  }
  document.getElementById("cal-body").innerHTML = html;
}

function openCalModal(k, d) {
  modalDate = k;
  document.getElementById("modal-title").textContent = d + " de " + MESES[calM] + ", " + calY;
  renderModalEvents();
  document.getElementById("ev-desc").value = "";
  document.getElementById("cal-modal").classList.remove("hidden");
}

function renderModalEvents() {
  const evs = D.events[modalDate] || [];
  let h = "";
  if (!evs.length) h = `<p class="txt-dim" style="font-size:.83rem;margin-bottom:8px">Sin eventos en este día</p>`;
  evs.forEach(ev => {
    const lbl = ev.tipo === "ensayo" ? "Ensayo" : ev.tipo === "presentacion" ? "Presentación" : "Otro";
    h += `<div class="ev-item ${ev.tipo}">
      <div style="flex:1"><span class="ev-tipo">${lbl} ${ev.hora}</span><div class="ev-desc">${ev.desc}</div></div>
      <button class="del-btn" onclick="delCalEvent(${ev.id})">✕</button>
    </div>`;
  });
  document.getElementById("modal-events").innerHTML = h;
}

function addCalEvent() {
  const desc = document.getElementById("ev-desc").value.trim();
  if (!desc) return;
  const ev = {id: Date.now(), tipo: document.getElementById("ev-tipo").value, hora: document.getElementById("ev-hora").value, desc};
  if (!D.events[modalDate]) D.events[modalDate] = [];
  D.events[modalDate].push(ev);
  save(); renderCal(); renderModalEvents();
  document.getElementById("ev-desc").value = "";
}

function delCalEvent(id) {
  D.events[modalDate] = (D.events[modalDate] || []).filter(e => e.id !== id);
  if (!D.events[modalDate].length) delete D.events[modalDate];
  save(); renderCal(); renderModalEvents();
}

function closeCalModal(e) {
  if (e.target === e.currentTarget) document.getElementById("cal-modal").classList.add("hidden");
}

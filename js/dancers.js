function toggleDanForm(show) {
  const f = document.getElementById("dan-form-wrap");
  if (show) { f.classList.remove("hidden"); } else { f.classList.add("hidden"); editDancerId = null; }
}

function saveDancer() {
  const nombre = document.getElementById("df-nombre").value.trim();
  if (!nombre) return;
  const d = {
    id: editDancerId || Date.now(),
    nombre,
    rol: document.getElementById("df-rol").value,
    telefono: document.getElementById("df-tel").value.trim(),
    correo: document.getElementById("df-correo").value.trim(),
    notas: document.getElementById("df-notas").value.trim()
  };
  if (editDancerId) { D.dancers = D.dancers.map(x => x.id === editDancerId ? d : x); }
  else D.dancers.push(d);
  editDancerId = null;
  ["df-nombre","df-tel","df-correo","df-notas"].forEach(id => document.getElementById(id).value = "");
  toggleDanForm(false); save(); renderDancers();
}

function editDancer(id) {
  const d = D.dancers.find(x => x.id === id); if (!d) return;
  editDancerId = id;
  document.getElementById("df-nombre").value = d.nombre;
  document.getElementById("df-rol").value = d.rol;
  document.getElementById("df-tel").value = d.telefono || "";
  document.getElementById("df-correo").value = d.correo || "";
  document.getElementById("df-notas").value = d.notas || "";
  document.getElementById("dan-form-title").textContent = "Editar integrante";
  toggleDanForm(true);
}

function deleteDancer(id) { D.dancers = D.dancers.filter(d => d.id !== id); save(); renderDancers(); }

function renderDancers() {
  const q = (document.getElementById("dan-search").value || "").toLowerCase();
  const filt = D.dancers.filter(d => d.nombre.toLowerCase().includes(q));
  let statsH = `<div class="stat-card"><div class="stat-num gold">${D.dancers.length}</div><div class="stat-lbl">Total integrantes</div></div>`;
  const roles = ["bailarín","bailarina","director/a","músico","utilero/a"];
  roles.forEach(r => {
    const cnt = D.dancers.filter(d => d.rol === r).length;
    if (!cnt) return;
    const c = ROLE_COLORS[r] || "#d4af37";
    statsH += `<div class="stat-card" style="border-color:${c}33"><div class="stat-num" style="color:${c}">${cnt}</div><div class="stat-lbl">${r.charAt(0).toUpperCase() + r.slice(1)}</div></div>`;
  });
  document.getElementById("dan-stats").innerHTML = statsH;
  let h = "";
  if (!filt.length) h = `<p class="txt-dim">Sin integrantes registrados.</p>`;
  filt.forEach(d => {
    const c = ROLE_COLORS[d.rol] || "#d4af37";
    h += `<div class="dancer-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="dancer-name">${d.nombre}</div>
          <span class="rol-badge" style="background:${c}22;color:${c}">${d.rol.toUpperCase()}</span>
        </div>
        <div class="dancer-actions">
          <button onclick="editDancer(${d.id})" title="Editar" style="color:var(--goldD)">✏️</button>
          <button onclick="deleteDancer(${d.id})" title="Eliminar" style="color:var(--txtD)">✕</button>
        </div>
      </div>
      ${d.telefono ? `<div class="dancer-info">📞 ${d.telefono}</div>` : ""}
      ${d.correo ? `<div class="dancer-info">✉️ ${d.correo}</div>` : ""}
      ${d.notas ? `<div class="dancer-info" style="font-style:italic">📝 ${d.notas}</div>` : ""}
    </div>`;
  });
  document.getElementById("dancers-grid").innerHTML = h;
}

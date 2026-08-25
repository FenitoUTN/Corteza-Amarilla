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
    h += `<div class="dancer-card" onclick="openDancerProfile(${d.id})" style="cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="dancer-name">${d.nombre}</div>
          <span class="rol-badge" style="background:${c}22;color:${c}">${d.rol.toUpperCase()}</span>
        </div>
        <div class="dancer-actions" onclick="event.stopPropagation()">
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

let activeProfileId = null;

function openDancerProfile(id) {
  const d = D.dancers.find(x => x.id === id); if (!d) return;
  activeProfileId = id;
  document.getElementById("dancer-modal-name").textContent = d.nombre;
  const c = ROLE_COLORS[d.rol] || "#d4af37";
  document.getElementById("dancer-modal-role").innerHTML = `<span class="rol-badge" style="background:${c}22;color:${c}">${d.rol.toUpperCase()}</span>`;
  document.getElementById("dancer-modal").classList.remove("hidden");
  renderWardrobeList();
}

function closeDancerModal(e) {
  if (e && e.target.id !== "dancer-modal") return;
  document.getElementById("dancer-modal").classList.add("hidden");
  activeProfileId = null;
}

function renderWardrobeList() {
  if (!activeProfileId) return;
  const items = getWardrobeForDancer(activeProfileId);
  let h = "";
  if (!items.length) {
    h = `<p class="txt-dim" style="font-size:0.8rem">No tiene vestuario asignado.</p>`;
  } else {
    items.forEach(item => {
      const isGroup = item.isGroupProperty === "grupo";
      const badgeClass = isGroup ? "w-badge-grupo" : "w-badge-personal";
      const badgeText = isGroup ? "Propiedad del Grupo" : "Propiedad Personal";
      h += `
        <div class="wardrobe-item">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.9rem">${item.name}</span>
            <button class="btn btn-ghost btn-sm" style="padding: 2px 6px; font-size: 0.7rem; border-color:var(--red); color:var(--red);" onclick="removeWardrobeItem('${item.id}'); renderWardrobeList()">Quitar</button>
          </div>
          <span class="w-badge ${badgeClass}">${badgeText}</span>
        </div>
      `;
    });
  }
  document.getElementById("wardrobe-list").innerHTML = h;
}

function handleAddWardrobe() {
  if (!activeProfileId) return;
  const nameInput = document.getElementById("w-name");
  const propSelect = document.getElementById("w-prop");
  addWardrobeItem(activeProfileId, nameInput.value, propSelect.value);
  nameInput.value = "";
  renderWardrobeList();
}

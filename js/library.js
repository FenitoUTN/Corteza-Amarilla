function renderLib() {
  let h = "";
  if (!D.blocks.length) h = `<p class="txt-dim" style="font-size:.8rem">Sin bloques todavía</p>`;
  D.blocks.forEach(b => {
    h += `<div class="block-item${selBlock === b.id ? " active" : ""}" onclick="selectBlock(${b.id})">
      <span style="font-size:1rem">🎶</span>
      <div style="flex:1"><div class="b-name">${b.nombre}</div><div class="b-cnt">${b.canciones.length} canción(es)</div></div>
      <button onclick="event.stopPropagation();deleteBlock(${b.id})" style="background:transparent;border:none;color:var(--txtD);cursor:pointer;padding:0 4px">✕</button>
    </div>`;
  });
  document.getElementById("block-list").innerHTML = h;
  renderSongs();
}

function addBlock() {
  const v = document.getElementById("nb-input").value.trim();
  if (!v) return;
  D.blocks.push({id: Date.now(), nombre: v, canciones: []});
  document.getElementById("nb-input").value = "";
  save(); renderLib();
}

function deleteBlock(id) {
  D.blocks = D.blocks.filter(b => b.id !== id);
  if (selBlock === id) selBlock = null;
  save(); renderLib();
}

function selectBlock(id) { selBlock = id; renderLib(); }

function renderSongs() {
  const cur = D.blocks.find(b => b.id === selBlock);
  if (!cur) {
    document.getElementById("song-panel").innerHTML = `<div class="lib-empty"><span class="big">🎵</span><p>Selecciona un bloque</p></div>`;
    return;
  }
  let h = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
    <h3 class="gold" style="font-family:Georgia,serif">${cur.nombre}</h3>
    <button class="btn btn-gold" onclick="toggleSongForm()" id="add-song-btn">+ Agregar canción</button>
  </div>`;
  h += `<div id="song-form-wrap" class="song-form hidden">
    <div class="form-row">
      <input class="inp" id="sf-titulo" placeholder="Título *" style="font-size:.82rem">
      <input class="inp" id="sf-artista" placeholder="Artista / Región" style="font-size:.82rem">
      <input class="inp" id="sf-dur" placeholder="Duración (3:45)" style="font-size:.82rem">
      <input class="inp" id="sf-notas" placeholder="Notas / figuras" style="font-size:.82rem">
    </div>
    <div class="btn-row">
      <button class="btn btn-gold" onclick="addSong()">Guardar</button>
      <button class="btn btn-ghost" onclick="toggleSongForm()">Cancelar</button>
    </div>
  </div>`;
  if (!cur.canciones.length) h += `<p class="txt-dim" style="font-size:.83rem">Sin canciones en este bloque</p>`;
  cur.canciones.forEach((s, i) => {
    h += `<div class="song-item">
      <div class="song-num">${i + 1}</div>
      <div style="flex:1">
        <div class="song-title">${s.titulo}</div>
        <div class="song-meta">${[s.artista, s.dur ? `⏱ ${s.dur}` : "", s.notas ? `📝 ${s.notas}` : ""].filter(Boolean).join("  ")}</div>
      </div>
      <button onclick="deleteSong(${cur.id},${s.id})" style="background:transparent;border:none;color:var(--txtD);cursor:pointer;font-size:.9rem;padding:2px 6px">✕</button>
    </div>`;
  });
  document.getElementById("song-panel").innerHTML = h;
}

function toggleSongForm() {
  const f = document.getElementById("song-form-wrap");
  if (f) f.classList.toggle("hidden");
}

function addSong() {
  const t = document.getElementById("sf-titulo").value.trim();
  if (!t) return;
  const s = {
    id: Date.now(),
    titulo: t,
    artista: document.getElementById("sf-artista").value.trim(),
    dur: document.getElementById("sf-dur").value.trim(),
    notas: document.getElementById("sf-notas").value.trim()
  };
  D.blocks = D.blocks.map(b => b.id === selBlock ? {...b, canciones: [...b.canciones, s]} : b);
  save(); renderLib();
}

function deleteSong(bid, sid) {
  D.blocks = D.blocks.map(b => b.id === bid ? {...b, canciones: b.canciones.filter(s => s.id !== sid)} : b);
  save(); renderLib();
}

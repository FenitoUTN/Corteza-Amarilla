function showSection(id, btn) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("sec-" + id).classList.add("active");
  btn.classList.add("active");
  if (id === "cal") renderCal();
  if (id === "lib") renderLib();
  if (id === "dan") renderDancers();
  if (id === "fee") renderFee();
}

function renderAll() { renderCal(); renderLib(); renderDancers(); renderFee(); }

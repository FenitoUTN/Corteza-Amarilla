document.getElementById("pw-input").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });

function doLogin() {
  const pw = document.getElementById("pw-input").value;
  if (pw === PASS) {
    load();
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    renderAll();
  } else {
    document.getElementById("login-err").textContent = "Contraseña incorrecta";
    setTimeout(() => document.getElementById("login-err").textContent = "", 2500);
  }
}

function doLogout() {
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("pw-input").value = "";
}

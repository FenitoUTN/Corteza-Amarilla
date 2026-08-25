const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const PASS = "corteza2024";
const ROLE_COLORS = {"bailarín":"#42a5f5","bailarina":"#e91e8c","director/a":"#d4af37","músico":"#4caf50","utilero/a":"#ff9800"};

let D = {events:{}, blocks:[], dancers:[], fees:{}, wardrobe:[], montoMensual:5000};
let calY = new Date().getFullYear(), calM = new Date().getMonth();
let feeY = new Date().getFullYear();
let selBlock = null, editDancerId = null, modalDate = null;

const _hoy = new Date();
const todayKey = `${_hoy.getFullYear()}-${String(_hoy.getMonth()+1).padStart(2,"0")}-${String(_hoy.getDate()).padStart(2,"0")}`;

function save() { try { localStorage.setItem("ca_data", JSON.stringify(D)); } catch(e) {} }
function load() { try { const s = localStorage.getItem("ca_data"); if (s) D = JSON.parse(s); } catch(e) {} }

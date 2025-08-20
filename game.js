// --- Detección móvil / input inicial ---
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  window.innerWidth <= 768 ||
  navigator.maxTouchPoints > 0;

const startText = document.getElementById("start-text");
const difficultyMenu = document.getElementById("difficulty-menu");
const difficultySel = document.getElementById("difficulty");
const playerInput = document.getElementById("player-name");
const nameWarning = document.getElementById("name-warning");
const playBtn = document.getElementById("play-btn");
const highscoresBtn = document.getElementById("highscores-btn");

// Sonidos
const startSound   = document.getElementById("start-sound");
const selectSound  = document.getElementById("select-sound");
const typeSound    = document.getElementById("type-sound");
const warningSound = document.getElementById("warning-sound");



// Mostrar menú cuando el usuario interactúa
function showDifficultyMenu() {
  difficultyMenu.classList.remove("hidden");
  startText.classList.add("hidden");
  // sonido opcional
  try { startSound.currentTime = 0; startSound.play(); } catch(e){}
}

if (isMobile) {
  startText.textContent = "TOCA PARA EMPEZAR";
  document.body.addEventListener("touchstart", showDifficultyMenu, { once: true });
} else {
  document.body.addEventListener("keydown", showDifficultyMenu, { once: true });
  document.body.addEventListener("click", showDifficultyMenu, { once: true });
}

// Sonido al cambiar dificultad
difficultySel.addEventListener("change", () => {
  try { selectSound.currentTime = 0; selectSound.play(); } catch(e){}
});

// Sonido al tipear nombre + recordar último nombre
playerInput.addEventListener("input", () => {
  try { typeSound.currentTime = 0; typeSound.play(); } catch(e){}
  localStorage.setItem("SCARGAME_LAST_NAME", playerInput.value);
});

// Autocompletar con el último nombre usado (si existe)
const lastName = localStorage.getItem("SCARGAME_LAST_NAME");
if (lastName && !playerInput.value) playerInput.value = lastName;

// Botón JUGAR: valida nombre y redirige a game.html con parámetros
playBtn.addEventListener("click", () => {
  const playerName = playerInput.value.trim();
  const difficulty = difficultySel.value;

  if (!playerName) {
    nameWarning.classList.remove("hidden");
    try { warningSound.currentTime = 0; warningSound.play(); } catch(e){}
    return;
  } else {
    nameWarning.classList.add("hidden");
  }

  playBtn.addEventListener("click", () => {
  const name = playerInput.value.trim();
  if (!name) {
    nameWarning.classList.remove("hidden");
    return;
  }
  

 const difficulty = document.getElementById('difficulty').value;
    // Redirige al juego pasando parámetros por URL
    window.location.href = `game.html?player=${encodeURIComponent(player)}&diff=${difficulty}`;
});


  // Construir URL con parámetros
  const params = new URLSearchParams({ player: playerName, diff: difficulty });
  // Si game.html está en la misma carpeta, esto basta:
  window.location.href = "game.html?" + params.toString();
  // Si lo tienes en otra ruta, ajústalo, por ejemplo: "./game/game.html?" + params
});

// Botón HIGH SCORES: abre la página servida por Node (carpeta /public del server)
highscoresBtn.addEventListener("click", () => {
  // Redirige en la misma pestaña
  window.location.href = "highscores.html";
});

// --- Carrusel de skins corregido ---
const skins = ["Gifs/points.gif", "Gifs/point2.gif", "Gifs/points3.gif"]; // tus 2 skins
let currentSkinIndex = 0;

const prevSkinBtn = document.getElementById("prev-skin");
const nextSkinBtn = document.getElementById("next-skin");
const currentSkinImg = document.getElementById("current-skin");

// Cargar skin guardada
const savedSkinIndex = localStorage.getItem("SCARGAME_SKIN_INDEX");
if (savedSkinIndex !== null) {
    currentSkinIndex = parseInt(savedSkinIndex);
    currentSkinImg.src = skins[currentSkinIndex];
}


function updateSkin(index) {
    currentSkinImg.src = skins[index];
    localStorage.setItem("SCARGAME_SKIN_INDEX", index); // guardamos índice
    try { selectSound.currentTime = 0; selectSound.play(); } catch(e){}
}

// Botones
prevSkinBtn.addEventListener("click", () => {
    currentSkinIndex = (currentSkinIndex - 1 + skins.length) % skins.length;
    updateSkin(currentSkinIndex);
});

nextSkinBtn.addEventListener("click", () => {
    currentSkinIndex = (currentSkinIndex + 1) % skins.length;
    updateSkin(currentSkinIndex);
});



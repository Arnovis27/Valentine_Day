/* ===== CONFIGURATION ===== */
const CONFIG = {
  matrixFontSize: 16,
  matrixFPS: 33,
  typeSpeed: 60,
  envelopeDelay: 700
};

/* ===== ELEMENTS ===== */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start");
const terminal = document.getElementById("terminal");
const envelope = document.getElementById("envelope");
const lines = document.querySelectorAll(".line");

const beep = document.getElementById("beep");
const openSound = document.getElementById("openSound");

/* ===== MATRIX ===== */
canvas.width = innerWidth;
canvas.height = innerHeight;

const MATRIX_CHARS = "♥LOVE0123456789";
const columns = canvas.width / CONFIG.matrixFontSize;
const drops = Array.from({ length: columns }, () => 1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff4d6d";
  ctx.font = `${CONFIG.matrixFontSize}px monospace`;

  drops.forEach((y, i) => {
    const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    ctx.fillText(char, i * CONFIG.matrixFontSize, y * CONFIG.matrixFontSize);

    if (y * CONFIG.matrixFontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

setInterval(drawMatrix, CONFIG.matrixFPS);

/* ===== TYPEWRITER ===== */
function typeLine(element, text) {
  return new Promise(resolve => {
    let index = 0;

    const interval = setInterval(() => {
      element.textContent += text[index];
      beep.currentTime = 0;
      beep.play().catch(() => {});
      index++;

      if (index >= text.length) {
        clearInterval(interval);
        element.classList.remove("cursor");
        resolve();
      }
    }, CONFIG.typeSpeed);
  });
}

async function startSequence() {
  for (const line of lines) {
    await typeLine(line, line.dataset.text);
  }

  setTimeout(() => {
    terminal.style.display = "none";
    envelope.style.display = "block";
  }, CONFIG.envelopeDelay);
}

/* ===== EVENTS ===== */
startScreen.addEventListener("click", () => {
  beep.play().then(() => {
    beep.pause();
    beep.currentTime = 0;
  });

  startScreen.style.display = "none";
  startSequence();
});

envelope.addEventListener("click", () => {
  if (!envelope.classList.contains("open")) {
    openSound.currentTime = 0;
    openSound.play().catch(() => {});
  }
  envelope.classList.toggle("open");
});

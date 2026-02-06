/* ===== MATRIX ===== */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizeCanvas();
addEventListener("resize", resizeCanvas);

const chars = "♥LOVE0123456789";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array.from({ length: columns }, () => 1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ff4d6d";
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 33);

/* ===== ELEMENTS ===== */
const beep = document.getElementById("beep");
const openSound = document.getElementById("openSound");
const lines = document.querySelectorAll(".line");
const terminal = document.getElementById("terminal");
const envelope = document.getElementById("envelope");
const startScreen = document.getElementById("start");

/* ===== TYPEWRITER ===== */
function typeLine(el, text, speed = 60) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      beep.currentTime = 0;
      beep.play().catch(() => {});
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        el.classList.remove("cursor");
        resolve();
      }
    }, speed);
  });
}

async function startSequence() {
  for (const line of lines) {
    await typeLine(line, line.dataset.text);
  }
  setTimeout(() => {
    terminal.style.display = "none";
    envelope.style.display = "block";
  }, 700);
}

/* ===== HEARTS ===== */
function spawnHearts() {
  const rect = envelope.getBoundingClientRect();
  const heartCount = 8;

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "❤️";

    const x =
      rect.left +
      Math.random() * rect.width;

    const y =
      rect.top +
      Math.random() * rect.height;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1500);
  }
}


/* ===== START ===== */
startScreen.addEventListener("click", () => {
  startScreen.style.display = "none";
  startSequence();
});

/* ===== ENVELOPE ===== */
envelope.addEventListener("click", () => {
  if (!envelope.classList.contains("open")) {
    openSound.currentTime = 0;
    openSound.play().catch(() => {});
    spawnHearts();
  }
  envelope.classList.toggle("open");
});

// Cat Cursor (PNG) + trailing "spine" line
// Put cat.png рядом с index.html

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Load cat png
const catImg = new Image();
catImg.src = "cat.png";

// Settings
const SEGMENTS = 60;          // длина хвоста (больше = длиннее)
const FOLLOW_SPEED = 0.18;    // скорость кота (0.1-0.3)
const TAIL_TIGHTNESS = 0.35;  // насколько хвост подтягивается (0.2-0.6)
const CAT_SIZE = 80;          // размер кота в пикселях

// "Head" position (cat position)
let cat = { x: mouse.x, y: mouse.y, vx: 0, vy: 0 };

// Tail points
const tail = [];
for (let i = 0; i < SEGMENTS; i++) {
  tail.push({ x: cat.x, y: cat.y });
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function draw() {
  requestAnimationFrame(draw);

  // Smoothly move cat toward mouse
  cat.x = lerp(cat.x, mouse.x, FOLLOW_SPEED);
  cat.y = lerp(cat.y, mouse.y, FOLLOW_SPEED);

  // Update tail: first point follows cat, others follow previous
  tail[0].x = lerp(tail[0].x, cat.x, 0.6);
  tail[0].y = lerp(tail[0].y, cat.y, 0.6);

  for (let i = 1; i < tail.length; i++) {
    tail[i].x = lerp(tail[i].x, tail[i - 1].x, TAIL_TIGHTNESS);
    tail[i].y = lerp(tail[i].y, tail[i - 1].y, TAIL_TIGHTNESS);
  }

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw tail line
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(tail[0].x, tail[0].y);
  for (let i = 1; i < tail.length; i++) {
    ctx.lineTo(tail[i].x, tail[i].y);
  }
  ctx.stroke();

  // Compute direction (for rotation)
  const dx = mouse.x - cat.x;
  const dy = mouse.y - cat.y;
  const angle = Math.atan2(dy, dx);

  // Draw cat image (rotated)
  if (catImg.complete && catImg.naturalWidth > 0) {
    ctx.save();
    ctx.translate(cat.x, cat.y);
    ctx.rotate(angle);

    // draw centered, slightly forward
    const w = CAT_SIZE;
    const h = CAT_SIZE;
    ctx.drawImage(catImg, -w / 2, -h / 2, w, h);

    ctx.restore();
  } else {
    // fallback: small dot while image loads
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(cat.x, cat.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // optional hint text
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.fillText("Move your mouse 🐾", 20, 30);
}

draw();

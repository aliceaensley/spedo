const speedCanvas = document.getElementById("speedMeter");
const rpmCanvas = document.getElementById("rpmMeter");
const speedCtx = speedCanvas.getContext("2d");
const rpmCtx = rpmCanvas.getContext("2d");

let engineOn = false;
let currentSpeed = 0;
let currentRPM = 0;
let currentGear = "P";
let currentFuel = 100;

// === DRAW FUNCTION ===
function drawMeter(ctx, value, max, color, labels, labelText) {
  const cx = ctx.canvas.width / 2;
  const cy = ctx.canvas.height / 2;
  const radius = cx - 8;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0.75 * Math.PI, 0.25 * Math.PI, false);
  ctx.strokeStyle = "rgba(0,255,255,0.2)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Numbers around
  ctx.font = "9px Arial";
  ctx.fillStyle = "cyan";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < labels.length; i++) {
    const angle = 0.75 * Math.PI + (i / (labels.length - 1)) * (1.5 * Math.PI);
    const x = cx + Math.cos(angle) * (radius - 10);
    const y = cy + Math.sin(angle) * (radius - 10);
    ctx.fillText(labels[i], x, y);
  }

  // Needle
  const needleAngle = 0.75 * Math.PI + (value / max) * (1.5 * Math.PI);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * Math.cos(needleAngle), cy + radius * Math.sin(needleAngle));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.stroke();

  // Center Text
  ctx.shadowBlur = 0;
  ctx.fillStyle = color;
  ctx.font = "bold 13px Arial";
  ctx.fillText(`${labelText}`, cx, cy + 15);
  ctx.font = "bold 18px Arial";
  ctx.fillText(`${Math.round(value)}`, cx, cy - 5);
}

// === UPDATE LOOP ===
function updateHUD() {
  const speedLabels = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
  const rpmLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  drawMeter(speedCtx, currentSpeed, 200, "cyan", speedLabels, "KMH");
  drawMeter(rpmCtx, currentRPM / 1000, 8, "lime", rpmLabels, "RPM");

  document.getElementById("gear").innerText = currentGear;
  document.getElementById("fuel").innerText = `Fuel: ${Math.round(currentFuel)}%`;
}

setInterval(updateHUD, 50);

// === FUNGSI UNTUK GAME ===
function setEngine(state) {
  engineOn = state;
  if (!engineOn) {
    currentRPM = 0;
    currentSpeed = 0;
  }
}

function setSpeed(speed) {
  currentSpeed = engineOn ? speed : 0;
}

function setRPM(rpm) {
  currentRPM = engineOn ? rpm : 0;
}

function setGear(gear) {
  currentGear = gear;
}

function setFuel(fuel) {
  currentFuel = fuel;
}

// === TEST MODE (hapus di game) ===
setEngine(true);
setInterval(() => {
  currentSpeed = (currentSpeed + 1) % 200;
  currentRPM = ((currentRPM + 150) % 8000);
}, 100);

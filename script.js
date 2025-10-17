const speedCanvas = document.getElementById("speedMeter");
const rpmCanvas = document.getElementById("rpmMeter");
const speedCtx = speedCanvas.getContext("2d");
const rpmCtx = rpmCanvas.getContext("2d");

let engineOn = false;
let currentSpeed = 0;
let displayedSpeed = 0;
let currentRPM = 0;
let displayedRPM = 0;
let currentGear = "N";
let currentFuel = 1;
let speedMode = 0; // 0 = KMH, 1 = MPH

// --- Draw gauge ---
function drawGauge(ctx, value, max, color, labels, unit) {
  const cx = ctx.canvas.width / 2;
  const cy = ctx.canvas.height / 2;
  const radius = cx - 8;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Arc background
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0.75 * Math.PI, 0.25 * Math.PI, false);
  ctx.strokeStyle = "rgba(0,255,255,0.2)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Numbers around
  ctx.font = "10px Arial";
  ctx.fillStyle = "cyan";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < labels.length; i++) {
    const angle = 0.75 * Math.PI + (i / (labels.length - 1)) * (1.5 * Math.PI);
    const x = cx + Math.cos(angle) * (radius - 12);
    const y = cy + Math.sin(angle) * (radius - 12);
    ctx.fillText(labels[i], x, y);
  }

  // Needle
  const clampedValue = Math.min(Math.max(value, 0), max);
  const angle = 0.75 * Math.PI + (clampedValue / max) * (1.5 * Math.PI);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 6;
  ctx.shadowColor = color;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center text
  ctx.fillStyle = color;
  ctx.font = "bold 15px Arial";
  ctx.fillText(Math.round(value), cx, cy - 5);
  ctx.font = "10px Arial";
  ctx.fillText(unit, cx, cy + 10);
}

// --- Update HUD ---
function updateHUD() {
  const speedLabels = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
  const rpmLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // Smooth animation
  displayedSpeed += (currentSpeed - displayedSpeed) * 0.15;
  displayedRPM += (currentRPM - displayedRPM) * 0.15;

  drawGauge(speedCtx, displayedSpeed, 200, "cyan", speedLabels, "KMH");
  drawGauge(rpmCtx, displayedRPM / 1000, 8, "lime", rpmLabels, "RPM");

  document.getElementById("gear").innerText = currentGear;
  document.getElementById("fuel").innerText = `Fuel: ${(currentFuel * 100).toFixed(0)}%`;

  requestAnimationFrame(updateHUD);
}
updateHUD();

// --- Functions (compatible with original JS) ---
function onOrOff(state) {
  return state ? "On" : "Off";
}

function setEngine(state) {
  engineOn = state;
  if (!state) {
    currentSpeed = 0;
    currentRPM = 0;
  }
}

function setSpeed(speed) {
  if (!engineOn) return;
  currentSpeed = speedMode === 1 ? Math.round(speed * 2.236936) : Math.round(speed * 3.6);
}

function setRPM(rpm) {
  if (!engineOn) return;
  currentRPM = rpm;
}

function setFuel(fuel) {
  currentFuel = fuel;
}

function setGear(gear) {
  currentGear = gear;
}

function setSpeedMode(mode) {
  speedMode = mode;
}

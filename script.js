let elements = {};
let speedMode = 0;
let engineOn = false;

let currentSpeed = 0;
let targetSpeed = 0;
let currentRPM = 0;
let targetRPM = 0;

const speedCanvas = document.getElementById("speedometer");
const rpmCanvas = document.getElementById("rpm");
const hud = document.getElementById("hud");

const sctx = speedCanvas.getContext("2d");
const rctx = rpmCanvas.getContext("2d");

// DRAW METER FUNCTION
function drawMeter(ctx, value, maxValue, label, step, colorFn, active) {
  const cx = ctx.canvas.width / 2;
  const cy = ctx.canvas.height / 2;
  const radius = 65;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0.75 * Math.PI, 0.25 * Math.PI);
  ctx.strokeStyle = active ? "rgba(255,255,255,0.15)" : "rgba(150,150,150,0.05)";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Number marks
  ctx.font = "10px Arial";
  ctx.fillStyle = active ? "#aaa" : "#555";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= maxValue; i += step) {
    const angle = 0.75 * Math.PI + (i / maxValue) * 1.5 * Math.PI;
    const x = cx + Math.cos(angle) * (radius - 12);
    const y = cy + Math.sin(angle) * (radius - 12);
    ctx.fillText(i, x, y);
  }

  // Needle
  const angle = 0.75 * Math.PI + (value / maxValue) * 1.5 * Math.PI;
  const color = active ? colorFn(value / maxValue) : "#666";

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.8;
  ctx.shadowBlur = active ? 10 : 0;
  ctx.shadowColor = color;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Value text
  ctx.font = "bold 13px Arial";
  ctx.fillStyle = active ? "#fff" : "#777";
  ctx.fillText(`${Math.round(value)} ${label}`, cx, cy + 32);
}

// BASIC FUNCTIONS
const onOrOff = (s) => (s ? "On" : "Off");

function setEngine(state) {
  engineOn = state;
  elements.engine.innerText = onOrOff(state);
  hud.classList.toggle("off", !state);
  if (!engineOn) {
    targetSpeed = 0;
    targetRPM = 0;
  }
}

function setSpeed(speed) {
  if (!engineOn) return;
  switch (speedMode) {
    case 1:
      targetSpeed = Math.min(speed * 2.236936, 240);
      break;
    case 2:
      targetSpeed = Math.min(speed * 1.943844, 240);
      break;
    default:
      targetSpeed = Math.min(speed * 3.6, 240);
  }
}

function setRPM(rpm) {
  if (!engineOn) return;
  targetRPM = Math.min(rpm * 8000, 8000);
}

function setFuel(fuel) {
  elements.fuel.innerText = `${(fuel * 100).toFixed(1)}%`;
}

function setHealth(health) {
  elements.health.innerText = `${(health * 100).toFixed(1)}%`;
}

function setGear(gear) {
  elements.gear.innerText = gear === 0 ? "N" : gear;
}

function setSeatbelts(state) {
  elements.seatbelts.innerText = onOrOff(state);
}

function setSpeedMode(mode) {
  speedMode = mode;
}

// ANIMATION LOOP
function animate() {
  const ease = 0.08;
  currentSpeed += (targetSpeed - currentSpeed) * ease;
  currentRPM += (targetRPM - currentRPM) * ease;

  const speedColor = (ratio) => `hsl(${190 - ratio * 60}, 100%, ${40 + ratio * 30}%)`;
  const rpmColor = (ratio) => {
    const hue = 120 - ratio * 120; // green → red
    return `hsl(${hue}, 100%, 50%)`;
  };

  drawMeter(sctx, currentSpeed, 240, "KMH", 20, speedColor, engineOn);
  drawMeter(rctx, currentRPM, 8000, "RPM", 1000, rpmColor, engineOn);

  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  elements = {
    engine: document.getElementById("engine"),
    fuel: document.getElementById("fuel"),
    health: document.getElementById("health"),
    gear: document.getElementById("gear"),
    seatbelts: document.getElementById("seatbelts"),
  };

  drawMeter(sctx, 0, 240, "KMH", 20, () => "#0ff", false);
  drawMeter(rctx, 0, 8000, "RPM", 1000, () => "#f33", false);

  animate();
});

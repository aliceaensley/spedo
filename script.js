let elements = {};
let speedMode = 0;
let indicators = 0;
let engineOn = false;

const speedCanvas = document.getElementById("speedometer");
const rpmCanvas = document.getElementById("rpm");
const sctx = speedCanvas.getContext("2d");
const rctx = rpmCanvas.getContext("2d");

function drawMeter(ctx, value, maxValue, label, step, color) {
  const cx = ctx.canvas.width / 2;
  const cy = ctx.canvas.height / 2;
  const radius = 65;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Arc background
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0.75 * Math.PI, 0.25 * Math.PI, false);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Numbers around circle
  ctx.font = "10px Arial";
  ctx.fillStyle = "#ccc";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= maxValue; i += step) {
    const angle = 0.75 * Math.PI + (i / maxValue) * (1.5 * Math.PI);
    const x = cx + Math.cos(angle) * (radius - 10);
    const y = cy + Math.sin(angle) * (radius - 10);
    ctx.fillText(i, x, y);
  }

  // Needle
  const angle = 0.75 * Math.PI + (value / maxValue) * (1.5 * Math.PI);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center point
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Text center
  ctx.fillStyle = "white";
  ctx.font = "bold 13px Arial";
  ctx.fillText(`${Math.round(value)} ${label}`, cx, cy + 30);
}

// ========= ORIGINAL FUNCTIONAL API ========= //

const onOrOff = (state) => (state ? "On" : "Off");

function setEngine(state) {
  engineOn = state;
  elements.engine.innerText = onOrOff(state);
}

function setSpeed(speed) {
  let val = 0;
  switch (speedMode) {
    case 1:
      val = speed * 2.236936;
      break; // MPH
    case 2:
      val = speed * 1.943844;
      break; // Knots
    default:
      val = speed * 3.6;
  }
  drawMeter(sctx, engineOn ? val : 0, 240, "KMH", 20, "#0ff");
}

function setRPM(rpm) {
  const val = engineOn ? rpm * 8000 : 0;
  drawMeter(rctx, val, 8000, "RPM", 1000, "#f33");
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

document.addEventListener("DOMContentLoaded", () => {
  elements = {
    engine: document.getElementById("engine"),
    fuel: document.getElementById("fuel"),
    health: document.getElementById("health"),
    gear: document.getElementById("gear"),
    seatbelts: document.getElementById("seatbelts"),
  };

  // Tampilan awal
  drawMeter(sctx, 0, 240, "KMH", 20, "#0ff");
  drawMeter(rctx, 0, 8000, "RPM", 1000, "#f33");
});

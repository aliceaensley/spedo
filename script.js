const speedCanvas = document.getElementById("speedometer");
const rpmCanvas = document.getElementById("rpm");
const sctx = speedCanvas.getContext("2d");
const rctx = rpmCanvas.getContext("2d");

let engineOn = false;
let speed = 0;
let rpm = 0;

// Fungsi menggambar meter analog dengan angka melingkar
function drawMeter(ctx, value, maxValue, label, step) {
  const cx = ctx.canvas.width / 2;
  const cy = ctx.canvas.height / 2;
  const radius = 70;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0.75 * Math.PI, 0.25 * Math.PI, false);
  ctx.strokeStyle = "rgba(0,255,255,0.2)";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Angka melingkar
  ctx.font = "10px Arial";
  ctx.fillStyle = "#0ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= maxValue; i += step) {
    const angle = 0.75 * Math.PI + (i / maxValue) * (1.5 * Math.PI);
    const x = cx + Math.cos(angle) * (radius - 12);
    const y = cy + Math.sin(angle) * (radius - 12);
    ctx.fillText(i, x, y);
  }

  // Needle
  const angle = 0.75 * Math.PI + (value / maxValue) * (1.5 * Math.PI);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 2;
  ctx.shadowBlur = 6;
  ctx.shadowColor = "#0ff";
  ctx.stroke();

  // Text tengah (nilai + label)
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.fillText(`${Math.round(value)} ${label}`, cx, cy + 35);
}

// Fungsi update tampilan
function updateHUD() {
  drawMeter(sctx, engineOn ? speed : 0, 240, "KMH", 20);
  drawMeter(rctx, engineOn ? rpm : 0, 8000, "RPM", 1000);
}

// Simulasi (bisa diganti dengan data RageMP nanti)
setInterval(() => {
  if (engineOn) {
    speed = Math.min(speed + 3, 240);
    rpm = Math.min(rpm + 200, 8000);
  } else {
    speed = Math.max(speed - 5, 0);
    rpm = Math.max(rpm - 300, 0);
  }
  updateHUD();
}, 100);

document.body.addEventListener("click", () => {
  engineOn = !engineOn;
});

const speedCanvas = document.getElementById('speedometerCanvas');
const rpmCanvas = document.getElementById('rpmCanvas');
const speedCtx = speedCanvas.getContext('2d');
const rpmCtx = rpmCanvas.getContext('2d');

let speed = 0;
let rpm = 0;
let engineOn = false;
let maxSpeed = 240;
let maxRPM = 8000;

function drawAnalogMeter(ctx, value, maxValue, labels = []) {
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const radius = cx - 8;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Arc background
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0.75 * Math.PI, 0.25 * Math.PI, false);
    ctx.strokeStyle = "rgba(0,255,255,0.15)";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Tick numbers
    ctx.font = "10px Arial";
    ctx.fillStyle = "#0ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for(let i=0;i<labels.length;i++){
        const ang = 0.75*Math.PI + (i/(labels.length-1))*1.5*Math.PI;
        const x = cx + Math.cos(ang)*(radius - 10);
        const y = cy + Math.sin(ang)*(radius - 10);
        ctx.fillText(labels[i], x, y);
    }

    // Arc foreground (value)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0.75 * Math.PI, 0.75 * Math.PI + (value/maxValue)*1.5*Math.PI, false);
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#0ff";
    ctx.stroke();

    // Needle
    const angle = 0.75*Math.PI + (value/maxValue)*1.5*Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI*2);
    ctx.fillStyle = "#0ff";
    ctx.fill();
}

// Label data
const speedLabels = [];
for(let i=0;i<=maxSpeed;i+=20) speedLabels.push(i);
const rpmLabels = [];
for(let i=0;i<=maxRPM;i+=1000) rpmLabels.push(i);

// Update visual
function updateHUD(){
    drawAnalogMeter(speedCtx, speed, maxSpeed, speedLabels);
    drawAnalogMeter(rpmCtx, rpm, maxRPM, rpmLabels);
    requestAnimationFrame(updateHUD);
}

// Simulasi (untuk tes manual)
setInterval(() => {
    if(engineOn){
        speed = (speed + 3) % maxSpeed;
        rpm = (rpm + 500) % maxRPM;
        document.getElementById("engine").innerText = "On";
    } else {
        document.getElementById("engine").innerText = "Off";
        speed = 0; rpm = 0;
    }
    document.getElementById("fuel").innerText = `${(Math.random()*100).toFixed(1)}%`;
    document.getElementById("health").innerText = `${(Math.random()*100).toFixed(1)}%`;
    document.getElementById("gear").innerText = engineOn ? "D" : "N";
}, 500);

// Toggle mesin (klik kanan untuk uji)
document.body.addEventListener('contextmenu', e => {
    e.preventDefault();
    engineOn = !engineOn;
});

updateHUD();

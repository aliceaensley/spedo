let elements = {};
let speedMode = 0; // 0: KMH, 1: MPH
let maxSpeed = 240, maxRPM = 8000;
let engineOn = false;

// Canvas
let speedCanvas, rpmCanvas, fuelCanvas, healthCanvas;
let speedCtx, rpmCtx, fuelCtx, healthCtx;

// Draw functions sama seperti sebelumnya
function drawAnalogMeter(ctx, value, maxValue){
    const cx = ctx.canvas.width/2, cy = ctx.canvas.height/2, radius = cx-10;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    // Outer
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0.75*Math.PI, 0.25*Math.PI, false);
    ctx.strokeStyle = "rgba(0,255,255,0.2)";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Needle
    const angle = 0.75*Math.PI + (value/maxValue)*(1.5*Math.PI);
    const grad = ctx.createLinearGradient(cx, cy, cx + radius*Math.cos(angle), cy + radius*Math.sin(angle));
    grad.addColorStop(0, "#0ff");
    grad.addColorStop(1, "#f00");

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius*Math.cos(angle), cy + radius*Math.sin(angle));
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#0ff";
    ctx.stroke();
}

function drawCircularBar(ctx, percent, color){
    const cx = ctx.canvas.width/2, cy = ctx.canvas.height/2, radius = cx-5;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    // Background
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI);
    ctx.strokeStyle = "rgba(0,255,255,0.1)";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Foreground
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI/2, -Math.PI/2 + 2*Math.PI*percent, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;
    ctx.stroke();
}

// Setters untuk input real
function setEngine(state){
    engineOn = state;
    elements.engine.innerText = state ? "On" : "Off";
    if(!engineOn){
        setSpeed(0);
        setRPM(0);
        setGear("N");
    }
}

function setSpeed(speed){ // speed dari game (m/s)
    const val = engineOn ? (speedMode==1 ? Math.round(speed*2.236936) : Math.round(speed*3.6)) : 0;
    elements.speed.innerText = val + (speedMode==1 ? ' MPH':' KMH');
    drawAnalogMeter(speedCtx, val, maxSpeed);
}

function setRPM(rpm){ // rpm dari game
    const val = engineOn ? rpm : 0;
    elements.rpm.innerText = Math.round(val);
    drawAnalogMeter(rpmCtx, val, maxRPM);
}

function setFuel(fuel){ // fuel 0-1
    elements.fuel.innerText = `${(fuel*100).toFixed(0)}%`;
    let color = fuel>0.7?"#0f0":fuel>0.3?"#ff0":"#f00";
    drawCircularBar(fuelCtx, fuel, color);
}

function setHealth(health){ // health 0-1
    elements.health.innerText = `${(health*100).toFixed(0)}%`;
    let color = health>0.7?"#0f0":health>0.3?"#ff0":"#f00";
    drawCircularBar(healthCtx, health, color);
}

function setGear(gear){ // angka atau N
    elements.gear.innerText = engineOn ? String(gear) : "N";
}

// Inisialisasi DOM & Canvas
document.addEventListener('DOMContentLoaded', ()=>{
    elements = {
        engine: document.getElementById('engine'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear')
    };
    speedCanvas = document.getElementById('speedometerCanvas');
    rpmCanvas = document.getElementById('rpmCanvas');
    fuelCanvas = document.getElementById('fuelCanvas');
    healthCanvas = document.getElementById('healthCanvas');

    speedCtx = speedCanvas.getContext('2d');
    rpmCtx = rpmCanvas.getContext('2d');
    fuelCtx = fuelCanvas.getContext('2d');
    healthCtx = healthCanvas.getContext('2d');
});

// Contoh integrasi dengan data game
// Misal: dari RageMP / FiveM / server JS
// mp.events.add('updateHUD', (engine, speed, rpm, fuel, health, gear)=>{
//      setEngine(engine);
//      setSpeed(speed);
//      setRPM(rpm);
//      setFuel(fuel);
//      setHealth(health);
//      setGear(gear);
// });

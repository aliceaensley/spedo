let elements = {};
let speedMode = 0; // 0: KMH, 1: MPH
let maxSpeed = 240, maxRPM = 8000;
let engineOn = false; // status mesin

// Canvas
let speedCanvas, rpmCanvas, fuelCanvas, healthCanvas;
let speedCtx, rpmCtx, fuelCtx, healthCtx;

// Draw Analog Meter
function drawAnalogMeter(ctx, value, maxValue){
    const cx = ctx.canvas.width/2;
    const cy = ctx.canvas.height/2;
    const radius = cx - 10;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    // Outer arc
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

// Circular Bar
function drawCircularBar(ctx, percent, color){
    const cx = ctx.canvas.width/2;
    const cy = ctx.canvas.height/2;
    const radius = cx - 5;
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

// Setters
function setEngine(state){
    engineOn = state;
    elements.engine.innerText = state ? "On" : "Off";

    if(!engineOn){
        setSpeed(0);
        setRPM(0);
        setGear("N");
    }
}

function setSpeed(speed){
    const val = engineOn ? (speedMode==1? Math.round(speed*2.236936): Math.round(speed*3.6)) : 0;
    elements.speed.innerText = val + (speedMode==1?' MPH':' KMH');
    drawAnalogMeter(speedCtx, val, maxSpeed);
}

function setRPM(rpm){
    const val = engineOn ? rpm : 0;
    elements.rpm.innerText = Math.round(val);
    drawAnalogMeter(rpmCtx, val, maxRPM);
}

function setFuel(fuel){
    elements.fuel.innerText = `${(fuel*100).toFixed(0)}%`;
    let color = fuel>0.7?"#0f0":fuel>0.3?"#ff0":"#f00";
    drawCircularBar(fuelCtx,fuel,color);
}

function setHealth(health){
    elements.health.innerText = `${(health*100).toFixed(0)}%`;
    let color = health>0.7?"#0f0":health>0.3?"#ff0":"#f00";
    drawCircularBar(healthCtx,health,color);
}

function setGear(gear){
    elements.gear.innerText = engineOn ? String(gear) : "N";
}

// Init
document.addEventListener('DOMContentLoaded',()=>{
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

    // Demo loop
    let speedVal=0, rpmVal=0, fuelVal=1, healthVal=1, gearVal=1;
    setEngine(false); // start off
    setInterval(()=>{
        // Contoh: update hanya jika engine on
        if(engineOn){
            speedVal = (speedVal+1)%maxSpeed;
            rpmVal = (rpmVal+50)%maxRPM;
            gearVal = Math.floor(Math.random()*6)+1;
        }
        fuelVal = Math.random();
        healthVal = Math.random();

        setSpeed(speedVal);
        setRPM(rpmVal);
        setFuel(fuelVal);
        setHealth(healthVal);
        setGear(gearVal);
    }, 50);
});

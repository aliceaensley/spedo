let elements = {};
let speedMode = 0; // 0: KMH, 1: MPH
let maxSpeed = 240; // Max for analog meter
let maxRPM = 8000;

// Init canvas
let speedCanvas, rpmCanvas, speedCtx, rpmCtx;

function drawMeter(ctx, value, maxValue) {
    let centerX = ctx.canvas.width/2;
    let centerY = ctx.canvas.height/2;
    let radius = ctx.canvas.width/2 - 10;

    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75*Math.PI, 0.25*Math.PI, false);
    ctx.strokeStyle = "rgba(0,255,255,0.3)";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw needle
    let angle = 0.75*Math.PI + (value/maxValue)*(1.5*Math.PI);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius*Math.cos(angle), centerY + radius*Math.sin(angle));
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#0ff";
    ctx.stroke();
}

function setSpeed(speed) {
    let val = speedMode==1? Math.round(speed*2.236936) : Math.round(speed*3.6);
    elements.speed.innerText = val + (speedMode==1?' MPH':' KMH');
    drawMeter(speedCtx, val, maxSpeed);
}

function setRPM(rpm) {
    elements.rpm.innerText = Math.round(rpm);
    drawMeter(rpmCtx, rpm, maxRPM);
}

function setGear(gear){ elements.gear.innerText = String(gear); }
function setFuel(fuel){
    elements.fuel.innerText = `${(fuel*100).toFixed(0)}%`;
    elements.fuel.classList.remove('fuel-high','fuel-medium','fuel-low');
    if(fuel>0.7) elements.fuel.classList.add('fuel-high');
    else if(fuel>0.3) elements.fuel.classList.add('fuel-medium');
    else elements.fuel.classList.add('fuel-low');
}
function setHealth(health){
    elements.health.innerText = `${(health*100).toFixed(0)}%`;
    elements.health.classList.remove('health-high','health-medium','health-low');
    if(health>0.7) elements.health.classList.add('health-high');
    else if(health>0.3) elements.health.classList.add('health-medium');
    else elements.health.classList.add('health-low');
}

document.addEventListener('DOMContentLoaded',()=>{
    elements = {
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear')
    };
    speedCanvas = document.getElementById('speedometerCanvas');
    rpmCanvas = document.getElementById('rpmCanvas');
    speedCtx = speedCanvas.getContext('2d');
    rpmCtx = rpmCanvas.getContext('2d');

    // Example update loop
    let speedVal = 0, rpmVal=0;
    setInterval(()=>{
        speedVal = (speedVal+1)%maxSpeed;
        rpmVal = (rpmVal+50)%maxRPM;
        setSpeed(speedVal);
        setRPM(rpmVal);
        setFuel(Math.random());
        setHealth(Math.random());
        setGear(Math.floor(Math.random()*6));
    },100);
});

const canvas = document.getElementById('hudCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width/2;
const centerY = canvas.height/2;
const radius = 120;

let elements = {};
let speedMode = 0;
let indicators = 0;
let engineOn = false;
let currentSpeed = 0;
let currentRPM = 0;
let currentFuel = 1;
let currentHealth = 1;
let currentGear = "N";
let headlightsState = 0;
let seatbeltsState = false;

// Info Panel Elements
document.addEventListener('DOMContentLoaded',()=>{
    elements = {
        engine: document.getElementById('engine'),
        gear: document.getElementById('gear'),
        headlights: document.getElementById('headlights'),
        seatbelts: document.getElementById('seatbelts'),
        indicators: document.getElementById('indicators'),
        speedMode: document.getElementById('speed-mode')
    };
});

// Draw circular dial
function drawDial(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX,centerY,radius,0,2*Math.PI);
    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle='#0ff';
    ctx.stroke();

    // Speed arc
    const maxSpeed = speedMode===1?150:240; // MPH or KMH
    const speedAngle = (currentSpeed/maxSpeed)*2*Math.PI - Math.PI/2;
    ctx.beginPath();
    ctx.arc(centerX,centerY,radius-10,-Math.PI/2,speedAngle);
    ctx.strokeStyle='#0ff';
    ctx.lineWidth=6;
    ctx.shadowBlur=10;
    ctx.shadowColor="#0ff";
    ctx.stroke();

    // RPM arc
    const rpmRadius = radius-30;
    const maxRPM = 10000;
    const rpmAngle = (currentRPM/maxRPM)*2*Math.PI - Math.PI/2;
    ctx.beginPath();
    ctx.arc(centerX,centerY,rpmRadius,-Math.PI/2,rpmAngle);
    ctx.strokeStyle='#f0f';
    ctx.lineWidth=4;
    ctx.shadowBlur=10;
    ctx.shadowColor="#f0f";
    ctx.stroke();

    // Digital Speed
    ctx.font = '32px Orbitron';
    ctx.fillStyle='#0ff';
    ctx.textAlign='center';
    ctx.fillText(Math.round(currentSpeed)+(speedMode===1?' MPH':' KMH'),centerX,centerY+10);

    // Digital RPM
    ctx.font = '20px Orbitron';
    ctx.fillStyle='#f0f';
    ctx.fillText(Math.round(currentRPM)+' RPM',centerX,centerY+40);

    // Fuel & Health bars (top-left inside dial)
    const barWidth = 80;
    const barHeight = 10;
    // Fuel
    ctx.fillStyle='rgba(0,255,255,0.2)';
    ctx.fillRect(centerX-140,centerY-120,barWidth,barHeight);
    ctx.fillStyle='cyan';
    ctx.fillRect(centerX-140,centerY-120,barWidth*currentFuel,barHeight);
    // Health
    ctx.fillStyle='rgba(255,0,255,0.2)';
    ctx.fillRect(centerX-140,centerY-100,barWidth,barHeight);
    ctx.fillStyle='magenta';
    ctx.fillRect(centerX-140,centerY-100,barWidth*currentHealth,barHeight);
}

// Update info panel
function updateInfoPanel(){
    elements.engine.innerText = `Engine: ${engineOn?"On":"Off"}`;
    elements.gear.innerText = `Gear: ${currentGear}`;
    elements.headlights.innerText = `Headlights: ${headlightsState===1?"On":headlightsState===2?"High":"Off"}`;
    elements.seatbelts.innerText = `Seatbelts: ${seatbeltsState?"On":"Off"}`;
    elements.indicators.innerText = `${indicators & 0b01?"On":"Off"}/${indicators & 0b10?"On":"Off"}`;
    elements.speedMode.innerText = `Speed Mode: ${speedMode===1?"MPH":"KMH"}`;
}

// Animation loop
function loop(){
    drawDial();
    updateInfoPanel();
    requestAnimationFrame(loop);
}
loop();

// API functions
function setEngine(state){ engineOn=state; if(!state){currentSpeed=0;currentRPM=0;} }
function setSpeed(speed){ if(!engineOn){currentSpeed=0; return;} currentSpeed=speed; }
function setRPM(rpm){ currentRPM = rpm; }
function setFuel(fuel){ currentFuel = fuel; }
function setHealth(health){ currentHealth = health; }
function setGear(gear){ currentGear = gear; }
function setHeadlights(state){ headlightsState = state; }
function setSeatbelts(state){ seatbeltsState = state; }
function setLeftIndicator(state){ indicators = (indicators & 0b10)|(state?0b01:0b00); }
function setRightIndicator(state){ indicators = (indicators & 0b01)|(state?0b10:0b00); }
function setSpeedMode(mode){ speedMode = mode; }

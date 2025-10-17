let elements = {};
let speedMode = 0; // 0 KMH, 1 MPH
let indicators = 0;
let engineOn = false;
let currentSpeed = 0;
let currentRPM = 0;
let currentFuel = 1;
let currentHealth = 1;
let currentGear = "N";
let headlightsState = 0;
let seatbeltsState = false;

// Utility
const onOrOff = state => state ? 'On' : 'Off';

// Update HUD
function updateHUD() {
    elements.speed.innerText = speedMode===1?Math.round(currentSpeed*2.236936):Math.round(currentSpeed*3.6);
    elements.speedUnit.innerText = speedMode===1?"MPH":"KMH";
    elements.rpm.innerText = Math.round(currentRPM);
    elements.engine.innerText = `Engine: ${engineOn?"On":"Off"}`;
    elements.fuel.style.width = `${(currentFuel*100).toFixed(0)}%`;
    elements.health.style.width = `${(currentHealth*100).toFixed(0)}%`;
    elements.gear.innerText = `Gear: ${currentGear}`;
    elements.headlights.innerText = `Headlights: ${headlightsState===1?"On":headlightsState===2?"High":"Off"}`;
    elements.seatbelts.innerText = `Seatbelts: ${seatbeltsState?"On":"Off"}`;
    elements.indicators.innerText = `${indicators & 0b01?"On":"Off"}/${indicators & 0b10?"On":"Off"}`;
    elements.speedMode.innerText = `Speed Mode: ${speedMode===1?"MPH":"KMH"}`;
    requestAnimationFrame(updateHUD);
}

// API Functions
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

// Init
document.addEventListener('DOMContentLoaded',()=>{
    elements = {
        engine: document.getElementById('engine'),
        speed: document.getElementById('speed'),
        speedUnit: document.getElementById('speed-unit'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        speedMode: document.getElementById('speed-mode')
    };
    updateHUD();
});

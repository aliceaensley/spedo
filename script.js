let elements = {};
let speedMode = 0;
let indicators = 0;

let targetSpeed = 0, currentSpeed = 0;
let targetRPM = 0, currentRPM = 0;
let targetFuel = 1, currentFuel = 1;
let targetHealth = 1, currentHealth = 1;

const onOrOff = state => state ? 'On' : 'Off';

function animate(){
    const lerp = (start, end, t) => start + (end-start)*t;

    currentSpeed = lerp(currentSpeed, targetSpeed, 0.1);
    currentRPM = lerp(currentRPM, targetRPM, 0.1);
    currentFuel = lerp(currentFuel, targetFuel, 0.05);
    currentHealth = lerp(currentHealth, targetHealth, 0.05);

    updateSpeed(currentSpeed);
    updateRPM(currentRPM);
    updateFuel(currentFuel);
    updateHealth(currentHealth);

    requestAnimationFrame(animate);
}

function setSpeed(speed){ targetSpeed = speed; }
function setRPM(rpm){ targetRPM = rpm; }
function setFuel(f){ targetFuel = f; }
function setHealth(h){ targetHealth = h; }

function setEngine(state){ elements.engine.innerText = onOrOff(state); }
function setGear(gear){ elements.gear.innerText = String(gear); }
function setHeadlights(state){ elements.headlights.innerText = state===1?'On':state===2?'High Beam':'Off'; }
function setSeatbelts(state){ elements.seatbelts.innerText = onOrOff(state); }
function setLeftIndicator(state){ indicators=(indicators&0b10)|(state?0b01:0); elements.indicators.innerText=`${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setRightIndicator(state){ indicators=(indicators&0b01)|(state?0b10:0); elements.indicators.innerText=`${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setSpeedMode(mode){ speedMode=mode; elements.speedMode.innerText=mode===1?'MPH':mode===2?'Knots':'KMH'; }

function updateSpeed(speed){
    let val = speedMode===1?Math.round(speed*2.236936):speedMode===2?Math.round(speed*1.943844):Math.round(speed*3.6);
    elements.speed.innerText = val + (speedMode===1?' MPH':speedMode===2?' Knots':' KMH');
    const circle = document.getElementById('speed-ring');
    const r = circle.r.baseVal.value;
    const c = 2*Math.PI*r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c*(1-Math.min(val/200,1));
}

function updateRPM(rpm){
    const val = Math.round(rpm);
    elements.rpm.innerText = val+' RPM';
    const circle = document.getElementById('rpm-ring');
    const r = circle.r.baseVal.value;
    const c = 2*Math.PI*r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c*(1-Math.min(val/10000,1));
}

function updateFuel(f){
    const circle = document.getElementById('fuel');
    const r = circle.r.baseVal.value;
    const c = 2*Math.PI*r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c*(1-Math.min(f,1));
    // warna dinamis
    circle.style.stroke = f>0.5?'#0f0':f>0.2?'#ff0':'#f00';
}

function updateHealth(h){
    const circle = document.getElementById('health');
    const r = circle.r.baseVal.value;
    const c = 2*Math.PI*r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c*(1-Math.min(h,1));
    circle.style.stroke = h>0.7?'#0f0':'#f00';
}

document.addEventListener('DOMContentLoaded', ()=>{
    elements = {
        engine: document.getElementById('engine'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        speedMode: document.getElementById('speed-mode')
    };
    animate(); // start animation
});

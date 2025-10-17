let elements = {};
let speedMode = 0; // 0=KMH,1=MPH,2=Knots
let indicators = 0;

// utility
const onOrOff = state => state ? 'On' : 'Off';

// data update functions
function setEngine(state){ elements.engine.innerText = onOrOff(state); }
function setGear(gear){ elements.gear.innerText = gear===0?'N':gear; }
function setHeadlights(state){ elements.headlights.innerText = state===1?'On':state===2?'High Beam':'Off'; }
function setLeftIndicator(state){ indicators = (indicators & 0b10) | (state?0b01:0); elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setRightIndicator(state){ indicators = (indicators & 0b01) | (state?0b10:0); elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setSeatbelts(state){ elements.seatbelts.innerText = onOrOff(state); }
function setSpeedMode(mode){ speedMode = mode; elements.speedMode.innerText = mode===1?'MPH':mode===2?'Knots':'KMH'; }

function setSpeed(speed){
    let val, percent;
    switch(speedMode){
        case 1: val = Math.round(speed*2.236936)+' MPH'; percent = Math.min(speed*2.236936/200,1); break;
        case 2: val = Math.round(speed*1.943844)+' Knots'; percent = Math.min(speed*1.943844/200,1); break;
        default: val = Math.round(speed*3.6)+' KMH'; percent = Math.min(speed*3.6/200,1);
    }
    elements.speed.innerText = val;
    elements.speedDisplay.textContent = val;

    const circumference = elements.speedCircle.r.baseVal.value * 2 * Math.PI;
    elements.speedCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    elements.speedCircle.style.strokeDashoffset = circumference * (1 - percent);
}

function setRPM(rpm){
    let val = Math.round(rpm*8000)+' RPM';
    elements.rpm.innerText = val;
    elements.rpmDisplay.textContent = val;

    const percent = Math.min(rpm,1);
    const circumference = elements.rpmCircle.r.baseVal.value * 2 * Math.PI;
    elements.rpmCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    elements.rpmCircle.style.strokeDashoffset = circumference * (1 - percent);
}

function setFuel(fuel){ elements.fuel.innerText = (fuel*100).toFixed(1)+'%'; }
function setHealth(health){ elements.health.innerText = (health*100).toFixed(1)+'%'; }

// simulate real-time update
function updateHUD(){
    // simulasikan data kendaraan
    const speed = Math.random()*50;  // m/s
    const rpm = Math.random();        // 0-1
    const fuel = Math.random();
    const health = Math.random();
    const gear = Math.floor(Math.random()*6);
    const engineOn = Math.random() > 0.2;

    setSpeed(speed);
    setRPM(rpm);
    setFuel(fuel);
    setHealth(health);
    setGear(gear);
    setEngine(engineOn);

    requestAnimationFrame(updateHUD);
}

document.addEventListener('DOMContentLoaded', ()=>{
    elements = {
        engine: document.getElementById('engine'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        speedMode: document.getElementById('speed-mode'),
        speedDisplay: document.getElementById('speed-display'),
        rpmDisplay: document.getElementById('rpm-display'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        speedCircle: document.getElementById('speed-circle'),
        rpmCircle: document.getElementById('rpm-circle')
    };

    updateHUD(); // start update loop
});

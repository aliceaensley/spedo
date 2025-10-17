let elements = {};
let speedMode = 0; // 0: KMH, 1: MPH, 2: Knots
let indicators = 0;

function onOrOff(state) { return state ? 'On' : 'Off'; }

function setEngine(state) { elements.engine.innerText = onOrOff(state); }

function setSpeed(speed) {
    let val;
    switch(speedMode) {
        case 1: val = Math.round(speed * 2.236936) + ' MPH'; break;
        case 2: val = Math.round(speed * 1.943844) + ' Knots'; break;
        default: val = Math.round(speed * 3.6) + ' KMH';
    }
    elements.speed.innerText = val;
    elements.speedDisplay.textContent = val;
}

function setRPM(rpm) {
    let val = Math.round(rpm * 8000) + ' RPM';
    elements.rpm.innerText = val;
    elements.rpmDisplay.textContent = val;
}

function setFuel(fuel) { elements.fuel.innerText = (fuel*100).toFixed(1)+'%'; }
function setHealth(health) { elements.health.innerText = (health*100).toFixed(1)+'%'; }
function setGear(gear) { elements.gear.innerText = gear===0?'N':gear; }
function setHeadlights(state) { elements.headlights.innerText = state===1?'On':state===2?'High Beam':'Off'; }

function setLeftIndicator(state){
    indicators=(indicators&0b10)|(state?0b01:0);
    elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`;
}

function setRightIndicator(state){
    indicators=(indicators&0b01)|(state?0b10:0);
    elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`;
}

function setSeatbelts(state){ elements.seatbelts.innerText = onOrOff(state); }

function setSpeedMode(mode){
    speedMode=mode;
    elements.speedMode.innerText = mode===1?'MPH':mode===2?'Knots':'KMH';
}

// Initialize elements
document.addEventListener('DOMContentLoaded', () => {
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
        rpm: document.getElementById('rpm')
    };
});

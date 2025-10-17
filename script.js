let elements = {};
let speedMode = 1;

const onOrOff = state => state ? 'On' : 'Off';

function setEngine(state) { elements.engine.innerText = onOrOff(state); }

function setSpeed(speed) {
    let val;
    switch(speedMode) {
        case 1: val = Math.round(speed*2.236936) + ' MPH'; break;
        case 2: val = Math.round(speed*1.943844) + ' Knots'; break;
        default: val = Math.round(speed*3.6) + ' KMH';
    }
    elements.speed.innerText = val;
    elements.speed.classList.add('dd-neon');
}

function setRPM(rpm) {
    elements.rpm.innerText = `${rpm.toFixed(0)} RPM`;
    elements.rpm.classList.add('dd-neon');
}

function setGear(gear) {
    elements.gear.innerText = String(gear);
    elements.gear.classList.add('dd-neon');
}

// Fuel & Health dinamis
function setFuel(fuel) {
    elements.fuel.innerText = `${(fuel*100).toFixed(0)}%`;
    elements.fuel.classList.remove('fuel-high','fuel-medium','fuel-low');
    if(fuel>0.7) elements.fuel.classList.add('fuel-high');
    else if(fuel>0.3) elements.fuel.classList.add('fuel-medium');
    else elements.fuel.classList.add('fuel-low');
}

function setHealth(health) {
    elements.health.innerText = `${(health*100).toFixed(0)}%`;
    elements.health.classList.remove('health-high','health-medium','health-low');
    if(health>0.7) elements.health.classList.add('health-high');
    else if(health>0.3) elements.health.classList.add('health-medium');
    else elements.health.classList.add('health-low');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        engine: document.getElementById('engine'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear'),
    };
});

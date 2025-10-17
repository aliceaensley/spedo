let elements = {};
let speedMode = 1;

const onOrOff = state => state ? 'On' : 'Off';

function setEngine(state) { elements.engine.innerText = onOrOff(state); }
function setSpeed(speed) {
    let val;
    switch(speedMode) {
        case 1: val = Math.round(speed * 2.236936) + ' MPH'; break;
        case 2: val = Math.round(speed * 1.943844) + ' Knots'; break;
        default: val = Math.round(speed * 3.6) + ' KMH';
    }
    elements.speed.innerText = val;
    elements.speed.classList.add('dd-neon');
}

function setRPM(rpm) {
    elements.rpm.innerText = `${rpm.toFixed(0)} RPM`;
    elements.rpm.classList.add('dd-neon');
}

function setFuel(fuel) { elements.fuel.innerText = `${(fuel*100).toFixed(0)}%`; }
function setHealth(health) { elements.health.innerText = `${(health*100).toFixed(0)}%`; }
function setGear(gear) { elements.gear.innerText = String(gear); }

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

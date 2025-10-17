let elements = {};
let speedMode = 1;
let indicators = 0;

const onOrOff = state => state ? 'On' : 'Off';

function setEngine(state){ elements.engine.innerText = onOrOff(state); }

function setSpeed(speed){
    switch(speedMode){
        case 1: elements.speed.innerText = `${Math.round(speed*2.236936)} MPH`; break;
        case 2: elements.speed.innerText = `${Math.round(speed*1.943844)} Knots`; break;
        default: elements.speed.innerText = `${Math.round(speed*3.6)} KMH`;
    }
}

function setRPM(rpm){ elements.rpm.innerText = `${Math.round(rpm)} RPM`; }

function setFuel(fuel){ elements.fuel.style.width = `${(fuel*100).toFixed(1)}%`; }

function setHealth(health){ elements.health.style.width = `${(health*100).toFixed(1)}%`; }

function setGear(gear){ elements.gear.innerText = String(gear); }

function setHeadlights(state){
    switch(state){
        case 1: elements.headlights.innerText = 'On'; break;
        case 2: elements.headlights.innerText = 'High Beam'; break;
        default: elements.headlights.innerText = 'Off';
    }
}

function setLeftIndicator(state){ 
    indicators = (indicators & 0b10)|(state?0b01:0b00);
    elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`;
}

function setRightIndicator(state){
    indicators = (indicators & 0b01)|(state?0b10:0b00);
    elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`;
}

function setSeatbelts(state){ elements.seatbelts.innerText = onOrOff(state); }

function setSpeedMode(mode){
    speedMode = mode;
    elements.speedMode.innerText = mode===1?'MPH':mode===2?'Knots':'KMH';
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
});

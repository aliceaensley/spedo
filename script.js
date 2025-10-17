let elements = {};
let speedMode = 0; // 0=KMH,1=MPH,2=Knots
let indicators = 0;

const onOrOff = state => state ? 'On' : 'Off';

function setEngine(state){ elements.engine.innerText = onOrOff(state); }
function setGear(gear){ elements.gear.innerText = gear===0?'N':gear; }
function setHeadlights(state){ elements.headlights.innerText = state===1?'On':state===2?'High Beam':'Off'; }
function setLeftIndicator(state){ indicators = (indicators & 0b10) | (state?0b01:0); elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setRightIndicator(state){ indicators = (indicators & 0b01) | (state?0b10:0); elements.indicators.innerText = `${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setSeatbelts(state){ elements.seatbelts.innerText = onOrOff(state); }
function setSpeedMode(mode){ speedMode = mode; elements.speedMode.innerText = mode===1?'MPH':mode===2?'Knots':'KMH'; }
function setSpeed(speed){
    switch(speedMode){
        case 1: elements.speed.innerText = `${Math.round(speed*2.236936)} MPH`; break;
        case 2: elements.speed.innerText = `${Math.round(speed*1.943844)} Knots`; break;
        default: elements.speed.innerText = `${Math.round(speed*3.6)} KMH`;
    }
}
function setRPM(rpm){ elements.rpm.innerText = `${Math.round(rpm*8000)} RPM`; }
function setFuel(fuel){ elements.fuel.innerText = `${(fuel*100).toFixed(1)}%`; }
function setHealth(health){ elements.health.innerText = `${(health*100).toFixed(1)}%`; }

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
        speedMode: document.getElementById('speed-mode'),
    };
});

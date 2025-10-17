let elements = {};
let speedMode = 0;
let indicators = 0;

const onOrOff = state=>state?'On':'Off';

function setEngine(state){ elements.engine.innerText=onOrOff(state); }
function setGear(gear){ elements.gear.innerText=String(gear); }
function setHeadlights(state){ elements.headlights.innerText=state===1?'On':state===2?'High Beam':'Off'; }
function setSeatbelts(state){ elements.seatbelts.innerText=onOrOff(state); }
function setLeftIndicator(state){ indicators=(indicators&0b10)|(state?0b01:0); elements.indicators.innerText=`${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setRightIndicator(state){ indicators=(indicators&0b01)|(state?0b10:0); elements.indicators.innerText=`${indicators&0b01?'On':'Off'} / ${indicators&0b10?'On':'Off'}`; }
function setSpeedMode(mode){ speedMode=mode; elements.speedMode.innerText=mode===1?'MPH':mode===2?'Knots':'KMH'; }

function setSpeed(speed){
  let val=speedMode===1?Math.round(speed*2.236936):speedMode===2?Math.round(speed*1.943844):Math.round(speed*3.6);
  elements.speed.innerText=val + (speedMode===1?' MPH':speedMode===2?' Knots':' KMH');
  const offset=314-(val/200*314); // assuming max speed 200
  document.getElementById('speed-ring').style.strokeDashoffset=offset;
}

function setRPM(rpm){
  elements.rpm.innerText=Math.round(rpm)+' RPM';
  const offset=314-(rpm/10000*314); // assuming max RPM 10000
  document.getElementById('rpm-ring').style.strokeDashoffset=offset;
}

function setFuel(f){ const offset=314-(f*314); document.getElementById('fuel').style.strokeDashoffset=offset; }
function setHealth(h){ const offset=314-(h*314); document.getElementById('health').style.strokeDashoffset=offset; }

document.addEventListener('DOMContentLoaded',()=>{
  elements={
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

let engineOn = false;
let speedMode = 0;
let currentSpeed = 0;
let displayedSpeed = 0;
let currentRPM = 0;
let displayedRPM = 0;
let currentGear = "N";
let currentFuel = 1;
let currentHealth = 1;
let headlightsState = 0;
let seatbeltsState = false;
let indicatorsState = 0;

function updateHUD(){
  displayedSpeed += (currentSpeed-displayedSpeed)*0.2;
  displayedRPM += (currentRPM-displayedRPM)*0.2;

  document.getElementById("speed-value").innerText = Math.round(displayedSpeed);
  document.getElementById("speed-unit").innerText = speedMode===1?"MPH":"KMH";

  document.getElementById("rpm-value").innerText = Math.round(displayedRPM);
  document.getElementById("rpm-unit").innerText = "RPM";

  document.getElementById("engine").innerText = `Engine: ${engineOn?"On":"Off"}`;
  document.getElementById("gear").innerText = `Gear: ${currentGear}`;
  document.getElementById("headlights").innerText = `Headlights: ${headlightsState===1?"On":headlightsState===2?"High":"Off"}`;
  document.getElementById("seatbelts").innerText = `Seatbelts: ${seatbeltsState?"On":"Off"}`;
  document.getElementById("indicators").innerText = `Indicators: ${indicatorsState&0b01?"On":"Off"}/${indicatorsState&0b10?"On":"Off"}`;
  document.getElementById("speed-mode").innerText = `Speed Mode: ${speedMode===1?"MPH":"KMH"}`;

  document.getElementById("fuel-bar").style.width = `${(currentFuel*100).toFixed(0)}%`;
  document.getElementById("health-bar").style.width = `${(currentHealth*100).toFixed(0)}%`;

  requestAnimationFrame(updateHUD);
}
updateHUD();

// --- Functional API ---
function setEngine(state){ engineOn=state; if(!state){currentSpeed=0;currentRPM=0;} }
function setSpeed(speed){ if(!engineOn){ currentSpeed=0; return; } currentSpeed = speedMode===1?Math.round(speed*2.236936):Math.round(speed*3.6); }
function setRPM(rpm){ currentRPM = rpm; }
function setGear(gear){ currentGear = gear; }
function setFuel(fuel){ currentFuel = fuel; }
function setHealth(health){ currentHealth = health; }
function setHeadlights(state){ headlightsState = state; }
function setSeatbelts(state){ seatbeltsState = state; }
function setLeftIndicator(state){ indicatorsState = (indicatorsState&0b10)|(state?0b01:0b00); }
function setRightIndicator(state){ indicatorsState = (indicatorsState&0b01)|(state?0b10:0b00); }
function setSpeedMode(mode){ speedMode=mode; }

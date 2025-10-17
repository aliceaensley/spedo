let engineOn = false;
let speedMode = 0; // 0=KMH,1=MPH
let currentSpeed = 0;
let displayedSpeed = 0;
let currentRPM = 0;
let displayedRPM = 0;
let currentGear = "N";

function updateHUD(){
  displayedSpeed += (currentSpeed-displayedSpeed)*0.2;
  displayedRPM += (currentRPM-displayedRPM)*0.2;

  document.getElementById("speed-value").innerText = Math.round(displayedSpeed);
  document.getElementById("speed-unit").innerText = speedMode===1?"MPH":"KMH";

  document.getElementById("rpm-value").innerText = Math.round(displayedRPM);
  document.getElementById("rpm-unit").innerText = "RPM";

  document.getElementById("gear").innerText = currentGear;
  document.getElementById("engine-display").innerText = `Engine: ${engineOn?"On":"Off"}`;

  requestAnimationFrame(updateHUD);
}
updateHUD();

// --- Functional API ---
function setEngine(state){ engineOn=state; if(!state){currentSpeed=0;currentRPM=0;} }
function setSpeed(speed){ if(!engineOn){ currentSpeed=0; return; } currentSpeed = speedMode===1?Math.round(speed*2.236936):Math.round(speed*3.6); }
function setRPM(rpm){ currentRPM = rpm; }
function setGear(gear){ currentGear = gear; }
function setSpeedMode(mode){ speedMode=mode; }

const speedCanvas = document.getElementById("speedMeter");
const rpmCanvas = document.getElementById("rpmMeter");
const speedCtx = speedCanvas.getContext("2d");
const rpmCtx = rpmCanvas.getContext("2d");

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

function drawGauge(ctx, value, max, color1, color2, labels, unit, healthPercent=null){
  const cx = ctx.canvas.width/2;
  const cy = ctx.canvas.height/2;
  const radius = cx-8;
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx,cy,radius,0.75*Math.PI,0.25*Math.PI,false);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Health ring (speedometer only)
  if(healthPercent!==null){
    ctx.beginPath();
    const endAngle = 0.75*Math.PI + (healthPercent/100)*1.5*Math.PI;
    ctx.arc(cx,cy,radius-5,0.75*Math.PI,endAngle,false);
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // Numbers
  ctx.font = "9px Helvetica";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for(let i=0;i<labels.length;i++){
    const angle = 0.75*Math.PI + (i/(labels.length-1))*1.5*Math.PI;
    const x = cx + Math.cos(angle)*(radius-12);
    const y = cy + Math.sin(angle)*(radius-12);
    ctx.fillStyle = "#fff";
    ctx.fillText(labels[i],x,y);
  }

  // Needle
  const val = Math.min(Math.max(value,0),max);
  const angle = 0.75*Math.PI + (val/max)*1.5*Math.PI;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx + radius*Math.cos(angle), cy + radius*Math.sin(angle));
  ctx.strokeStyle = color1;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center text
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px Helvetica";
  ctx.fillText(Math.round(value), cx, cy-5);
  ctx.font = "9px Helvetica";
  ctx.fillText(unit, cx, cy+12);
}

function updateHUD(){
  const speedLabels = [0,20,40,60,80,100,120,140,160,180,200];
  const rpmLabels = [0,1000,2000,3000,4000,5000,6000,7000];

  displayedSpeed += (currentSpeed-displayedSpeed)*0.15;
  displayedRPM += (currentRPM-displayedRPM)*0.15;

  drawGauge(speedCtx, displayedSpeed,200,"#0f0","#fff",speedLabels,"KMH", currentHealth);
  drawGauge(rpmCtx, displayedRPM,7000,"#0ff","#fff",rpmLabels,"RPM");

  document.getElementById("gear").innerText = currentGear;
  document.getElementById("fuel").innerText = `Fuel: ${(currentFuel*100).toFixed(0)}%`;
  document.getElementById("health").innerText = `Health: ${(currentHealth*100).toFixed(0)}%`;
  document.getElementById("engine").innerText = `Engine: ${engineOn?"On":"Off"}`;
  document.getElementById("headlights").innerText = `Headlights: ${headlightsState===1?"On":headlightsState===2?"High":"Off"}`;
  document.getElementById("seatbelts").innerText = `Seatbelts: ${seatbeltsState?"On":"Off"}`;
  document.getElementById("indicators").innerText = `Indicators: ${indicatorsState&0b01?"On":"Off"}/${indicatorsState&0b10?"On":"Off"}`;
  document.getElementById("speed-mode").innerText = `Speed Mode: ${speedMode===1?"MPH":"KMH"}`;

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

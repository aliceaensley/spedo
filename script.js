const speedCanvas = document.getElementById("speedMeter");
const rpmCanvas = document.getElementById("rpmMeter");
const speedCtx = speedCanvas.getContext("2d");
const rpmCtx = rpmCanvas.getContext("2d");

// --- State ---
let engineOn = false;
let speedMode = 0; // 0=KMH,1=MPH
let currentSpeed = 0;
let displayedSpeed = 0;
let currentRPM = 0;
let displayedRPM = 0;
let currentGear = "N";
let currentFuel = 1;
let currentHealth = 1;
let headlightsState = 0;
let seatbeltsState = false;
let indicatorsState = 0; // bitmask L/R

// --- Draw circular gauge ---
function drawGauge(ctx, value, max, color1, color2, labels, unit, healthPercent=null){
  const cx = ctx.canvas.width/2;
  const cy = ctx.canvas.height/2;
  const radius = cx-8;
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx,cy,radius,0.75*Math.PI,0.25*Math.PI,false);
  ctx.strokeStyle = "rgba(255,0,0,0.2)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Health indicator ring (if provided)
  if(healthPercent!==null){
    ctx.beginPath();
    const endAngle = 0.75*Math.PI + (healthPercent/100)*1.5*Math.PI;
    ctx.arc(cx,cy,radius-5,0.75*Math.PI,endAngle,false);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "red";
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Numbers
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for(let i=0;i<labels.length;i++){
    const angle = 0.75*Math.PI + (i/(labels.length-1))*1.5*Math.PI;
    const x = cx + Math.cos(angle)*(radius-12);
    const y = cy + Math.sin(angle)*(radius-12);
    ctx.fillStyle = i%2===0 ? color1 : color2;
    ctx.fillText(labels[i],x,y);
  }

  // Needle
  const val = Math.min(Math.max(value,0),max);
  const angle = 0.75*Math.PI + (val/max)*1.5*Math.PI;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx + radius*Math.cos(angle), cy + radius*Math.sin(angle));
  ctx.strokeStyle = color1;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color1;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center text
  ctx.fillStyle = color2;
  ctx.font = "bold 14px Arial";
  ctx.fillText(Math.round(value), cx, cy-5);
  ctx.font = "10px Arial";
  ctx.fillText(unit, cx, cy+12);
}

// --- Update HUD ---
function updateHUD(){
  const speedLabels = [0,20,40,60,80,100,120,140,160,180,200];
  const rpmLabels = [0,1,2,3,4,5,6,7,8];

  // Smooth animation
  displayedSpeed += (currentSpeed-displayedSpeed)*0.15;
  displayedRPM += (currentRPM-displayedRPM)*0.15;

  drawGauge(speedCtx, displayedSpeed,200,"red","cyan",speedLabels,"KMH", currentHealth);
  drawGauge(rpmCtx, displayedRPM/1000,8,"lime","blue",rpmLabels,"RPM");

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

// --- Original functional API ---
function onOrOff(state){return state?"On":"Off";}

function setEngine(state){ engineOn=state; if(!state){currentSpeed=0;currentRPM=0;} }
function setSpeed(speed){ if(!engineOn) return; currentSpeed = speedMode===1?Math.round(speed*2.236936):Math.round(speed*3.6); }
function setRPM(rpm){ if(!engineOn) return; currentRPM = rpm; }
function setGear(gear){ currentGear = gear; }
function setFuel(fuel){ currentFuel = fuel; }
function setHealth(health){ currentHealth = health; }
function setHeadlights(state){ headlightsState = state; }
function setSeatbelts(state){ seatbeltsState = state; }
function setLeftIndicator(state){ indicatorsState = (indicatorsState&0b10)|(state?0b01:0b00); }
function setRightIndicator(state){ indicatorsState = (indicatorsState&0b01)|(state?0b10:0b00); }
function setSpeedMode(mode){ speedMode=mode; }

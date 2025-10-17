let currentSpeed = 0;
let currentRPM = 0;
let currentFuel = 0;
let currentHealth = 0;

function animate() {
    // Lerp function untuk animasi smooth
    const lerp = (start, end, t) => start + (end - start) * t;

    currentSpeed = lerp(currentSpeed, targetSpeed, 0.1);
    currentRPM   = lerp(currentRPM, targetRPM, 0.1);
    currentFuel  = lerp(currentFuel, targetFuel, 0.05);
    currentHealth= lerp(currentHealth, targetHealth, 0.05);

    // Update visual
    updateSpeed(currentSpeed);
    updateRPM(currentRPM);
    updateFuel(currentFuel);
    updateHealth(currentHealth);

    requestAnimationFrame(animate);
}

// Replace setSpeed/setRPM/setFuel/setHealth with target values
let targetSpeed = 0;
let targetRPM = 0;
let targetFuel = 1;
let targetHealth = 1;

function setSpeed(speed) { targetSpeed = speed; }
function setRPM(rpm) { targetRPM = rpm; }
function setFuel(f) { targetFuel = f; }
function setHealth(h) { targetHealth = h; }

// Update functions (internal)
function updateSpeed(speed){
    let val = speedMode===1?Math.round(speed*2.236936):speedMode===2?Math.round(speed*1.943844):Math.round(speed*3.6);
    elements.speed.innerText = val + (speedMode===1?' MPH':speedMode===2?' Knots':' KMH');
    const circle = document.getElementById('speed-ring');
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c * (1 - Math.min(val/200,1));
}

function updateRPM(rpm){
    elements.rpm.innerText = Math.round(rpm) + ' RPM';
    const circle = document.getElementById('rpm-ring');
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c * (1 - Math.min(rpm/10000,1));
}

function updateFuel(f){
    const circle = document.getElementById('fuel');
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c * (1 - Math.min(f,1));
}

function updateHealth(h){
    const circle = document.getElementById('health');
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c * (1 - Math.min(h,1));
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
    animate(); // start animation loop
});

let elements = {};
let totalTime = 0; // Detik
let totalDistance = 0; // KM
let totalSpeedSum = 0; // Untuk menghitung Avg Speed
let speedMode = 0; // 0: KMH

const MAX_SPEED = 220; // Max speed pada gauge yang ringkas
const MIN_ANGLE = 225; // Sudut start (0 KMH)
const ANGLE_RANGE = 270; // 225 hingga 45 (sudut total 270 derajat)

// --- FUNGSI GAUGE ---

function mapSpeedToAngle(speed) {
    const clampedSpeed = Math.min(MAX_SPEED, Math.max(0, speed));
    const percentage = clampedSpeed / MAX_SPEED;
    
    // Rotasi searah jarum jam dari 225 derajat
    return MIN_ANGLE + (percentage * ANGLE_RANGE);
}

// --- FUNGSI PEMBARUAN DATA ---

function setSpeed(speed_ms) {
    const speed_kmh = Math.round(speed_ms * 3.6);
    
    // Tampilkan nilai digital
    if (elements.speedValue) elements.speedValue.innerText = String(speed_kmh).padStart(3, '0');

    // Atur posisi jarum
    const angle = mapSpeedToAngle(speed_kmh);
    if (elements.gaugeNeedle) {
        elements.gaugeNeedle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    }
    
    return speed_kmh;
}

function setTimeDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const display = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (elements.timeDisplay) elements.timeDisplay.innerText = display;
}

function setAvgSpeed(avg_kmh) {
    if (elements.avgSpeed) elements.avgSpeed.innerHTML = `${Math.round(avg_kmh)}<span class="unit-small">KMH</span>`;
}

function setDistance(distance_km) {
    if (elements.distance) elements.distance.innerHTML = `${distance_km.toFixed(1)}<span class="unit-small">km</span>`;
}

function setBattery(level) {
    if (elements.batteryLevel) elements.batteryLevel.innerText = `${level}%`;
}


// --- KONTROL SIMULASI ---

function startSimulation() {
    let currentSpeed_ms = 0;
    
    // Reset nilai awal simulasi
    totalTime = 0;
    totalDistance = 0;
    totalSpeedSum = 0;
    let batteryLevel = 100;

    simulationInterval = setInterval(() => {
        
        // 1. Simulasi Speed (Bergerak secara acak)
        currentSpeed_ms += (Math.random() - 0.5) * 1.5; 
        currentSpeed_ms = Math.max(0, Math.min(70, currentSpeed_ms)); // Batasi 0-70 m/s
        
        const speed_kmh = setSpeed(currentSpeed_ms);
        
        // 2. Simulasi Waktu, Jarak, dan Avg Speed
        totalTime += 1; // 1 detik
        totalDistance += (speed_kmh / 3600); // Konversi KMH ke KM/detik
        totalSpeedSum += speed_kmh;

        setTimeDuration(totalTime);
        setDistance(totalDistance);
        
        const avgSpeed = totalTime > 0 ? totalSpeedSum / totalTime : 0;
        setAvgSpeed(avgSpeed);
        
        // 3. Simulasi Baterai (Turun perlahan)
        if (totalTime % 60 === 0) { // Turun 1% setiap menit
            batteryLevel = Math.max(0, batteryLevel - 1);
            setBattery(batteryLevel);
        }

    }, 1000); // Update setiap 1 detik
}


// --- INISIALISASI ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        gaugeNeedle: document.getElementById('gauge-needle'),
        speedValue: document.getElementById('speed-value'),
        speedUnit: document.getElementById('speed-unit'),
        timeDisplay: document.getElementById('time-display'),
        distance: document.getElementById('distance'),
        avgSpeed: document.getElementById('avg-speed'),
        batteryLevel: document.getElementById('battery-level'),
    };

    // 2. Set Data Awal
    setSpeed(0);
    setBattery(100);
    
    // 3. Mulai Simulasi
    startSimulation(); 
});

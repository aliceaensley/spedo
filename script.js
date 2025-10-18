let elements = {};
let totalTime = 0; // Detik
let totalDistance = 0; // KM
let totalSpeedSum = 0; // Untuk menghitung Avg Speed
let simulationInterval = null;

const MAX_SPEED = 220; // KMH
const MIN_ANGLE = 225; // Sudut start (0 KMH)
const ANGLE_RANGE = 270; // Jangkauan sudut 

// --- FUNGSI GAUGE ---

function mapSpeedToAngle(speed) {
    const clampedSpeed = Math.min(MAX_SPEED, Math.max(0, speed));
    const percentage = clampedSpeed / MAX_SPEED;
    return MIN_ANGLE + (percentage * ANGLE_RANGE);
}

// --- FUNGSI PEMBARUAN DATA ---

function setSpeed(speed_ms) {
    const speed_kmh = Math.round(speed_ms * 3.6);
    if (elements.speedValue) elements.speedValue.innerText = String(speed_kmh).padStart(3, '0');

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
    
    // Format: 0:00:00
    const display = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (elements.durationDisplay) elements.durationDisplay.innerText = display;
}

function setVitals(data) {
    if (elements.batteryLevel) elements.batteryLevel.innerText = `${data.battery}%`;
    if (elements.signalLevel) elements.signalLevel.innerText = `${data.signal}%`;
    
    if (elements.altitude) elements.altitude.innerHTML = `${Math.round(data.altitude)}<span class="unit-small">ft</span>`;
    if (elements.avgSpeed) elements.avgSpeed.innerHTML = `${Math.round(data.avgSpeed)}<span class="unit-small">KMH</span>`;
    if (elements.distance) elements.distance.innerHTML = `${data.distance.toFixed(1)}<span class="unit-small">km</span>`;
}


// --- KONTROL SIMULASI LENGKAP ---

function startSimulation() {
    let currentSpeed_ms = 0;
    let currentAltitude = 0;
    let batteryLevel = 100;
    let signalLevel = 75;

    // Set nilai awal
    setSpeed(0);
    setVitals({
        battery: batteryLevel,
        signal: signalLevel,
        altitude: 0,
        avgSpeed: 0,
        distance: 0
    });
    setTimeDuration(0);

    simulationInterval = setInterval(() => {
        
        // 1. Simulasi Speed & Jarak
        currentSpeed_ms += (Math.random() - 0.5) * 1.5; 
        currentSpeed_ms = Math.max(0, Math.min(60, currentSpeed_ms)); 
        const speed_kmh = setSpeed(currentSpeed_ms);
        
        totalTime += 1; 
        totalDistance += (speed_kmh / 3600); 
        totalSpeedSum += speed_kmh;

        // 2. Simulasi Data Tambahan
        currentAltitude += (Math.random() - 0.5) * 5; // Ubah ketinggian
        currentAltitude = Math.max(0, currentAltitude);
        
        if (totalTime % 60 === 0) { 
            batteryLevel = Math.max(1, batteryLevel - 1);
        }
        
        // 3. Update Semua
        setTimeDuration(totalTime);
        const avgSpeed = totalTime > 0 ? totalSpeedSum / totalTime : 0;
        
        setVitals({
            battery: batteryLevel,
            signal: Math.max(10, Math.round(75 + (Math.random() * 25 - 10))), // Sinyal sedikit berfluktuasi
            altitude: currentAltitude,
            avgSpeed: avgSpeed,
            distance: totalDistance
        });

    }, 1000); 
}


// --- INISIALISASI ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        // Gauge
        gaugeNeedle: document.getElementById('gauge-needle'),
        speedValue: document.getElementById('speed-value'),
        speedUnit: document.getElementById('speed-unit'),
        
        // Header
        durationDisplay: document.getElementById('duration-display'),
        batteryLevel: document.getElementById('battery-level'),
        signalLevel: document.getElementById('signal-level'),
        
        // Vitals
        altitude: document.getElementById('altitude'),
        distance: document.getElementById('distance'),
        avgSpeed: document.getElementById('avg-speed'),
        settingsIcon: document.getElementById('settings-icon'),
    };
    
    // 2. Mulai Simulasi
    startSimulation(); 
    
    // 3. Tambahkan fungsi klik sederhana untuk ikon Settings
    if (elements.settingsIcon) {
        elements.settingsIcon.addEventListener('click', () => {
            alert("Settings Pop-up! (Dalam simulasi ini, tidak ada menu yang dibuka)");
        });
    }
});

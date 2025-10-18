let elements = {};
let totalDistance = 0; // KM
let totalSpeedSum = 0; // Untuk menghitung Avg Speed
let simulationInterval = null;
let clockInterval = null; // Interval baru untuk jam

const MAX_SPEED = 220; // KMH
const MIN_ANGLE = 225; // Sudut start (0 KMH)
const ANGLE_RANGE = 270; // Jangkauan sudut 

// --- FUNGSI GAUGE ---

function mapSpeedToAngle(speed) {
    const clampedSpeed = Math.min(MAX_SPEED, Math.max(0, speed));
    const percentage = clampedSpeed / MAX_SPEED;
    return MIN_ANGLE + (percentage * ANGLE_RANGE);
}

// --- FUNGSI BARU: JAM REALTIME (HH:MM:SS) ---

function updateRealtimeClock() {
    const now = new Date();
    // Menggunakan padStart(2, '0') untuk memastikan format dua digit (09, bukan 9)
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    // Format: HH:MM:SS (atau HH:DD:YY sesuai permintaan, yang biasa diinterpretasikan sebagai HH:MM:SS)
    const display = `${h}:${m}:${s}`;
    if (elements.durationDisplay) elements.durationDisplay.innerText = display;
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
    let totalTimeCounter = 0; // Digunakan hanya untuk simulasi Vitals, bukan untuk display Jam

    // Start Realtime Clock
    updateRealtimeClock();
    clockInterval = setInterval(updateRealtimeClock, 1000); 

    // Reset nilai awal
    totalDistance = 0;
    totalSpeedSum = 0;

    // Set nilai awal Vitals
    setSpeed(0);
    setVitals({
        battery: batteryLevel,
        signal: 75,
        altitude: 0,
        avgSpeed: 0,
        distance: 0
    });

    simulationInterval = setInterval(() => {
        
        // 1. Simulasi Speed & Jarak
        currentSpeed_ms += (Math.random() - 0.5) * 1.5; 
        currentSpeed_ms = Math.max(0, Math.min(60, currentSpeed_ms)); 
        const speed_kmh = setSpeed(currentSpeed_ms);
        
        totalTimeCounter += 1; // Penghitung waktu simulasi
        totalDistance += (speed_kmh / 3600); 
        totalSpeedSum += speed_kmh;

        // 2. Simulasi Data Tambahan
        currentAltitude += (Math.random() - 0.5) * 5; 
        currentAltitude = Math.max(0, currentAltitude);
        
        if (totalTimeCounter % 60 === 0) { 
            batteryLevel = Math.max(1, batteryLevel - 1);
        }
        
        // 3. Update Vitals
        const avgSpeed = totalTimeCounter > 0 ? totalSpeedSum / totalTimeCounter : 0;
        
        setVitals({
            battery: batteryLevel,
            signal: Math.max(10, Math.round(75 + (Math.random() * 25 - 10))),
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
        durationDisplay: document.getElementById('duration-display'), // Sekarang untuk Jam Realtime
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
    
    // 3. Fungsi klik untuk ikon Settings
    if (elements.settingsIcon) {
        elements.settingsIcon.addEventListener('click', () => {
            alert("Settings Pop-up! (Dalam simulasi ini, ikon ini tidak membuka menu)");
        });
    }
});

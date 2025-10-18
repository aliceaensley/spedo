let elements = {};
let speedMode = 0; // 0: KMH, 1: MPH, 2: Knots (Asumsi 0 adalah KMH dari gambar)
let simulationInterval = null;
let timeInterval = null;

// --- KONSTANTA GAUGE ---
const MIN_SPEED = 0;
const MAX_SPEED = 260; // Max speed pada gauge
const MIN_ANGLE = 225; // Sudut start (0 KMH)
const MAX_ANGLE = 45;  // Sudut akhir (260 KMH)
const ANGLE_RANGE = 360 - (MIN_ANGLE - MAX_ANGLE); // 180 + 45 + 45 = 270 derajat

// --- FUNGSI UTILITY ---

/**
 * Memetakan nilai kecepatan ke sudut rotasi jarum.
 * @param {number} speed - Nilai kecepatan yang ditampilkan (misal 141 KMH).
 * @returns {number} Sudut rotasi CSS (misal 225 hingga 45).
 */
function mapSpeedToAngle(speed) {
    // Pastikan kecepatan berada dalam batas gauge
    const clampedSpeed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed));
    
    // Hitung persentase dari jangkauan
    const percentage = clampedSpeed / MAX_SPEED; 
    
    // Hitung sudut rotasi
    // Sudut = MIN_ANGLE + (Persentase * Jangkauan)
    // Karena kita bergerak dari 225 ke 45 (berlawanan arah jarum jam dari 225-360-0-45)
    
    // Sudut 225 (0%) -> 45 (100%)
    const angle = MIN_ANGLE + (percentage * ANGLE_RANGE);
    
    // Perbaikan: Karena rotasi CSS berjalan searah jarum jam:
    // 0 KMH = 225 deg
    // 260 KMH = 225 + 270 = 495 deg. (atau 495 - 360 = 135)
    // Jika MAX_ANGLE adalah 45, maka 360 - 225 = 135. 135 + 45 = 180. (Error di visualisasi awal)
    
    // Asumsi: 225 (0) -> 0 -> 45 (260)
    // Sudut Rotasi: Sudut Rotasi (dari 0) = 225 + (Persentase * 270)
    const finalAngle = MIN_ANGLE + (percentage * ANGLE_RANGE);
    
    return finalAngle; 
}


// --- FUNGSI PEMBARUAN DATA ---

function setSpeed(speed_ms) {
    let speedValue;
    let unitText;
    
    switch(speedMode)
    {
        case 1: speedValue = Math.round(speed_ms * 2.236936); unitText = 'mph'; break; 
        case 2: speedValue = Math.round(speed_ms * 1.943844); unitText = 'knots'; break; 
        default: speedValue = Math.round(speed_ms * 3.6); unitText = 'kmh'; // KMH
    }

    // Tampilkan nilai digital di tengah gauge
    if (elements.speedValue) elements.speedValue.innerText = String(speedValue).padStart(3, '0');
    if (elements.speedUnit) elements.speedUnit.innerText = unitText;

    // Atur posisi jarum
    const gaugeValue = speedValue; // Asumsi gauge menggunakan unit yang sama
    const angle = mapSpeedToAngle(gaugeValue);
    if (elements.gaugeNeedle) {
        // Kita gunakan rotate(Xdeg)
        elements.gaugeNeedle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    }
}

function setTimeDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const display = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (elements.durationDisplay) elements.durationDisplay.innerText = display;
}

function setVitals(data) {
    if (elements.batteryLevel) elements.batteryLevel.innerText = `${data.battery}%`;
    if (elements.satellitesCount) elements.satellitesCount.innerText = `${data.satellites}/${data.maxSatellites}`;
    if (elements.signalLevel) elements.signalLevel.innerText = `${data.signal}%`;
    
    if (elements.altitude) elements.altitude.innerText = `${data.altitude.toFixed(1)}ft`;
    if (elements.longitude) elements.longitude.innerText = `${data.longitude.toFixed(2)}`;
    if (elements.latitude) elements.latitude.innerText = `${data.latitude.toFixed(2)}`;
    
    if (elements.avgSpeed) elements.avgSpeed.innerHTML = `${data.avgSpeed}<span class="unit-large">KMH</span>`;
    if (elements.distance) elements.distance.innerHTML = `${data.distance.toFixed(1)}<span class="unit-large">km</span>`;
}


// --- KONTROL SIMULASI ---

function startSimulation() {
    let currentSpeed_ms = 0;
    let totalTime = 516; // 0:08:36
    let totalDistance = 3.8;
    let avgSpeed = 95;

    simulationInterval = setInterval(() => {
        // Simulasi Speed (Bergerak secara acak)
        currentSpeed_ms += (Math.random() - 0.5) * 1.5; 
        currentSpeed_ms = Math.max(0, Math.min(100, currentSpeed_ms)); // Batasi 0-100 m/s
        
        setSpeed(currentSpeed_ms);
        
        // Simulasi Time dan Distance
        totalTime += 1; // 1 detik
        totalDistance += (currentSpeed_ms * 3.6 / 3600); // Konversi m/s ke km/detik
        avgSpeed = ((avgSpeed * (totalTime - 1)) + (currentSpeed_ms * 3.6)) / totalTime;
        
        setTimeDuration(totalTime);
        
        // Update Vitals Digital
        setVitals({
            battery: 84,
            satellites: 5,
            maxSatellites: 17,
            signal: 44,
            altitude: 416.7,
            longitude: 33.49,
            latitude: 79.10,
            avgSpeed: Math.round(avgSpeed),
            distance: totalDistance
        });

    }, 1000); // Update setiap 1 detik
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
        satellitesCount: document.getElementById('satellites-count'),
        signalLevel: document.getElementById('signal-level'),
        
        // Vitals
        altitude: document.getElementById('altitude'),
        longitude: document.getElementById('longitude'),
        latitude: document.getElementById('latitude'),
        avgSpeed: document.getElementById('avg-speed'),
        distance: document.getElementById('distance'),
    };

    // 2. Set Data Awal (Sesuai Gambar)
    setSpeedMode(0); // KMH
    setSpeed(141 / 3.6); // 141 KMH ke m/s
    setTimeDuration(516);
    setVitals({
        battery: 84,
        satellites: 5,
        maxSatellites: 17,
        signal: 44,
        altitude: 416.7,
        longitude: 33.49,
        latitude: 79.10,
        avgSpeed: 95,
        distance: 3.8
    });
    
    // 3. Mulai Simulasi
    startSimulation(); 
});

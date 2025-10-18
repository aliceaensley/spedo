let elements = {};
let totalDistanceTraveled = 0; // KM
let maxSpeedReached = 0; // KMH
let avgSpeedSum = 0; // Untuk perhitungan rata-rata
let tripDurationSeconds = 0;
let simulationInterval = null;

// --- GAUGE PARAMETERS ---
const GAUGE_MAX_SPEED = 200; 
const GAUGE_MIN_ANGLE = 225; 
const GAUGE_MAX_ANGLE = 495; 
const GAUGE_ANGLE_RANGE = GAUGE_MAX_ANGLE - GAUGE_MIN_ANGLE;

// --- FUNGSI GAUGE ---
function mapSpeedToGaugeAngle(speed_kmh) {
    const clampedSpeed = Math.min(GAUGE_MAX_SPEED, Math.max(0, speed_kmh));
    const percentage = clampedSpeed / GAUGE_MAX_SPEED;
    return GAUGE_MIN_ANGLE + (percentage * GAUGE_ANGLE_RANGE);
}

// --- FUNGSI PEMBARUAN DATA ---
function setSpeed(speed_ms) {
    const speed_kmh = Math.round(speed_ms * 3.6); 
    
    // Update jarum
    const angle = mapSpeedToGaugeAngle(speed_kmh);
    if (elements.speedNeedle) {
        elements.speedNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }

    // Update digital speed di nav
    if (elements.digitalSpeedVal) {
        elements.digitalSpeedVal.innerText = String(speed_kmh).padStart(3, '0');
    }

    // Update Max Speed
    if (speed_kmh > maxSpeedReached) {
        maxSpeedReached = speed_kmh;
        if (elements.maxSpeedVal) elements.maxSpeedVal.innerText = maxSpeedReached;
        if (elements.largeMaxSpeedVal) elements.largeMaxSpeedVal.innerText = maxSpeedReached;
    }
    
    return speed_kmh;
}

// updateGPSInfo DIHAPUS

function updateTripData(distance_km, avgSpeed_kmh) {
    if (elements.totalDistance) elements.totalDistance.innerText = `${distance_km.toFixed(3)}KM`;
    if (elements.distanceVal) elements.distanceVal.innerText = distance_km.toFixed(1); 
    if (elements.avgSpeedVal) elements.avgSpeedVal.innerText = Math.round(avgSpeed_kmh);
}

function toggleIndicator(lightElement, isActive) {
    if (lightElement) {
        lightElement.classList.toggle('active', isActive);
    }
}


// --- KONTROL SIMULASI LENGKAP ---
function startSimulation() {
    let currentSpeed_ms = 0;
    
    // Reset data trip
    totalDistanceTraveled = 0;
    maxSpeedReached = 0;
    avgSpeedSum = 0;
    tripDurationSeconds = 0;

    // Set nilai awal
    setSpeed(0);
    // updateGPSInfo DIHAPUS
    updateTripData(0, 0);

    simulationInterval = setInterval(() => {
        
        tripDurationSeconds += 1;

        // 1. Simulasi Speed (m/s)
        currentSpeed_ms += (Math.random() - 0.5) * 2; 
        currentSpeed_ms = Math.max(0, Math.min(60, currentSpeed_ms)); 
        const speed_kmh = setSpeed(currentSpeed_ms);
        
        // 2. Simulasi Jarak
        totalDistanceTraveled += (speed_kmh / 3600); 

        // 3. Simulasi Avg Speed
        avgSpeedSum += speed_kmh;
        const currentAvgSpeed = tripDurationSeconds > 0 ? avgSpeedSum / tripDurationSeconds : 0;
        
        // 4. Update Trip Data
        updateTripData(totalDistanceTraveled, currentAvgSpeed);
        
        // 5. Simulasi Indikator Lampu
        toggleIndicator(elements.engineLight, speed_kmh > 100 && Math.random() < 0.1); 
        toggleIndicator(elements.handbrakeLight, speed_kmh === 0 && Math.random() < 0.2); 

        // 6. Simulasi GPS Info DIHAPUS

    }, 1000); 
}

// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        // Header (GPS Info dihapus)
        // gpsConnectivityVal: document.getElementById('gps-connectivity-val'),
        // satelliteCountVal: document.getElementById('satellite-count-val'),

        // Gauge
        speedNeedle: document.getElementById('speed-needle'),
        engineLight: document.querySelector('.engine-light'),
        handbrakeLight: document.querySelector('.handbrake-light'),
        totalDistance: document.getElementById('total-distance'),

        // Bottom Nav
        digitalSpeedVal: document.getElementById('digital-speed-val'),

        // Right Panel Data
        maxSpeedVal: document.getElementById('max-speed-val'),
        distanceVal: document.getElementById('distance-val'),
        avgSpeedVal: document.getElementById('avg-speed-val'),
        largeMaxSpeedVal: document.getElementById('large-max-speed-val'),
    };
    
    // 2. Mulai Simulasi
    startSimulation(); 
    
    // 3. Tambahkan event listener untuk tombol navigasi dan aksi (tetap sama)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            if (this.classList.contains('digital-nav-item')) {
                 console.log("Mode Digital dipilih!");
            } else if (this.textContent.includes('Map')) {
                 console.log("Mode Map dipilih!");
            } else {
                 console.log("Mode Analog dipilih!");
            }
        });
    });

    document.querySelectorAll('.action-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            if (this.classList.contains('play-icon')) {
                console.log("Play / Start Recording clicked!");
            } else if (this.classList.contains('settings-icon')) {
                console.log("Settings clicked!");
            } else if (this.classList.contains('warning-icon')) {
                console.log("Warning / Alert clicked!");
            } else if (this.classList.contains('reload-icon')) {
                console.log("Reload / Reset Trip clicked!");
                clearInterval(simulationInterval);
                startSimulation();
            }
        });
    });
});

let elements = {};
let totalDistanceTraveled = 0; // KM
let maxSpeedReached = 0; // KMH
let avgSpeedSum = 0; 
let tripDurationSeconds = 0;
let simulationInterval = null;

// --- GAUGE PARAMETERS ---
const GAUGE_MAX_SPEED = 200; 
const GAUGE_MIN_ANGLE = -135; 
const GAUGE_MAX_ANGLE = 135; 
const GAUGE_ANGLE_RANGE = GAUGE_MAX_ANGLE - GAUGE_MIN_ANGLE; 

// --- FUNGSI GAUGE ---
function mapSpeedToGaugeAngle(speed_kmh) {
    const clampedSpeed = Math.min(GAUGE_MAX_SPEED, Math.max(0, speed_kmh));
    const percentage = clampedSpeed / GAUGE_MAX_SPEED;
    return GAUGE_MIN_ANGLE + (percentage * GAUGE_ANGLE_RANGE);
}

function setSpeed(speed_ms) {
    const speed_kmh = Math.round(speed_ms * 3.6); 
    
    // 1. Update Jarum (Needle)
    const angle = mapSpeedToGaugeAngle(speed_kmh);
    if (elements.speedNeedle) {
        elements.speedNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
    
    // 2. Update digital speed di nav
    if (elements.digitalSpeedVal) {
        elements.digitalSpeedVal.innerText = String(speed_kmh).padStart(3, '0');
    }
    
    // Note: Max Speed data box sudah dihapus, jadi tidak ada update max speed di sini.
    // Namun, kita tetap menghitung total distance untuk display 'TOTAL'
    
    return speed_kmh;
}

function updateTripData(distance_km) {
    // Hanya update TOTAL KM yang tersisa
    if (elements.totalDistance) elements.totalDistance.innerText = `${distance_km.toFixed(3)}KM`;
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
    
    // Set nilai awal
    setSpeed(0);
    updateTripData(0); // Hanya total distance

    simulationInterval = setInterval(() => {
        
        // 1. Simulasi Speed (m/s)
        currentSpeed_ms += (Math.random() - 0.5) * 1; 
        currentSpeed_ms = Math.max(0, Math.min(60, currentSpeed_ms)); 
        const speed_kmh = setSpeed(currentSpeed_ms);
        
        // 2. Simulasi Jarak
        totalDistanceTraveled += (speed_kmh / 3600); 
        
        // 3. Update Trip Data (Hanya total distance)
        updateTripData(totalDistanceTraveled);
        
        // 4. Simulasi Indikator Lampu
        toggleIndicator(elements.engineLight, speed_kmh > 100 && Math.random() < 0.1); 
        toggleIndicator(elements.handbrakeLight, speed_kmh < 5 && Math.random() < 0.2); 
        toggleIndicator(elements.seatbeltLight, speed_kmh > 10 && Math.random() < 0.05);

    }, 1000); 
}


// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        // Gauge
        speedNeedle: document.getElementById('speed-needle'),
        engineLight: document.querySelector('.engine-light'),
        handbrakeLight: document.querySelector('.handbrake-light'),
        seatbeltLight: document.querySelector('.seatbelt-light'),
        totalDistance: document.getElementById('total-distance'), 

        // Bottom Nav
        digitalSpeedVal: document.getElementById('digital-speed-val'),

        // Right Panel Data - SEMUA DIHAPUS
    };
    
    // 2. Mulai Simulasi
    startSimulation(); 
    
    // 3. Tambahkan event listener 
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            console.log(`Mode ${this.textContent.trim()} dipilih!`);
        });
    });

    document.querySelectorAll('.action-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            if (this.classList.contains('reload-icon')) {
                console.log("Reload / Reset Trip clicked!");
                clearInterval(simulationInterval);
                startSimulation();
            }
        });
    });
});

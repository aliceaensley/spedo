let elements = {};
let totalDistanceTraveled = 0; // KM
let maxSpeedReached = 0; 
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
        const needleBaseOffset = 90 - 10; 
        elements.speedNeedle.style.transform = `translateX(-50%) translateY(calc(90px - ${needleBaseOffset}px)) rotate(${angle}deg)`;
    }
    
    // 2. Update Large Digital Display (BARU)
    if (elements.digitalSpeedLarge) {
        elements.digitalSpeedLarge.innerText = String(speed_kmh).padStart(3, '0');
    }
    
    if (speed_kmh > maxSpeedReached) {
        maxSpeedReached = speed_kmh;
    }
    
    return speed_kmh;
}

function updateTripData(distance_km) {
    if (elements.totalDistance) elements.totalDistance.innerText = `${distance_km.toFixed(3)}KM`;
}

function toggleIndicator(lightElement, isActive) {
    if (lightElement) {
        lightElement.classList.toggle('active', isActive);
    }
}


// --- FUNGSI TOGGLE VIEW BARU ---
function toggleView(viewId) {
    const isAnalog = viewId === 'analog-nav';
    
    // 1. Toggle View Containers
    elements.analogView.classList.toggle('hidden-view', !isAnalog);
    elements.digitalView.classList.toggle('hidden-view', isAnalog);

    // 2. Toggle Nav Button States
    elements.analogNav.classList.toggle('active', isAnalog);
    elements.digitalNav.classList.toggle('active', !isAnalog);
    // Pastikan Map tidak aktif saat Analog/Digital dipilih
    elements.mapNav.classList.remove('active');
}


// --- KONTROL SIMULASI ---
function startSimulation() {
    let currentSpeed_ms = 0;
    
    totalDistanceTraveled = 0;
    maxSpeedReached = 0;
    
    setSpeed(0);
    updateTripData(0); 

    simulationInterval = setInterval(() => {
        
        currentSpeed_ms += (Math.random() - 0.5) * 1; 
        currentSpeed_ms = Math.max(0, Math.min(60, currentSpeed_ms)); 
        const speed_kmh = setSpeed(currentSpeed_ms);
        
        totalDistanceTraveled += (speed_kmh / 3600); 
        
        updateTripData(totalDistanceTraveled);
        
        // Simulasikan indikator
        toggleIndicator(elements.engineLight, speed_kmh > 100 && Math.random() < 0.1); 
        toggleIndicator(elements.handbrakeLight, speed_kmh < 5 && Math.random() < 0.2); 
        toggleIndicator(elements.seatbeltLight, speed_kmh > 10 && Math.random() < 0.05);

    }, 1000); 
}


// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        speedNeedle: document.getElementById('speed-needle'),
        engineLight: document.querySelector('.engine-light'),
        handbrakeLight: document.querySelector('.handbrake-light'),
        seatbeltLight: document.querySelector('.seatbelt-light'),
        totalDistance: document.getElementById('total-distance'), 
        
        // Elemen View Baru
        analogView: document.getElementById('analog-view'),
        digitalView: document.getElementById('digital-view'),
        digitalSpeedLarge: document.getElementById('digital-speed-large'), // BARU
        
        // Elemen Navigasi
        analogNav: document.querySelector('.analog-nav-item'),
        digitalNav: document.querySelector('.digital-nav-item'),
        mapNav: document.querySelector('.map-nav-item'),
    };
    
    // 2. Setup Awal
    // Pastikan Analog View aktif secara default dan Digital View tersembunyi
    elements.analogView.classList.remove('hidden-view');
    elements.digitalView.classList.add('hidden-view');

    // 3. Mulai Simulasi
    startSimulation(); 
    
    // 4. Tambahkan event listener untuk navigasi
    elements.analogNav.addEventListener('click', function() {
        toggleView('analog-nav');
    });

    elements.digitalNav.addEventListener('click', function() {
        toggleView('digital-nav');
    });

    // Logika klik untuk tombol Map (misalnya, menyembunyikan kedua tampilan dan mengaktifkan tombol Map)
    elements.mapNav.addEventListener('click', function() {
        elements.analogView.classList.add('hidden-view');
        elements.digitalView.classList.add('hidden-view');
        elements.analogNav.classList.remove('active');
        elements.digitalNav.classList.remove('active');
        this.classList.add('active');
        console.log(`Mode Map dipilih!`);
    });


    // 5. Event listener untuk tombol Aksi
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

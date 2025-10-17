let elements = {};
let speedMode = 1; 
let indicators = 0; 

const onOrOff = state => state ? 'On' : 'Off';

// Helper function for toggling active state
const toggleActive = (element, state) => {
    // Fungsi ini sekarang juga menerima array elemen
    if (Array.isArray(element)) {
        element.forEach(el => toggleActive(el, state));
        return;
    }
    
    if (state) {
        element.classList.add('active');
    } else {
        element.classList.remove('active');
    }
};

/**
 * Toggles the visibility of the Head Unit/Tablet UI.
 */
function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const speedometer = elements.speedometerUI; 
    
    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        tablet.classList.remove('hidden');
        speedometer.classList.add('hidden'); // Sembunyikan speedometer utama
        console.log(`[HEAD UNIT] Status: OPENED (Main UI Hidden)`);
    } else {
        tablet.classList.add('hidden');
        speedometer.classList.remove('hidden'); // Tampilkan speedometer utama
        console.log(`[HEAD UNIT] Status: CLOSED (Main UI Visible)`);
    }
}


/**
 * Updates the display of the engine state and its icon.
 */
function setEngine(state) {
    toggleActive([elements.engineIcon, elements.tabletEngineIcon], state);
}

/**
 * Updates the speed display based on the current speed mode.
 */
function setSpeed(speed) {
    let speedValue;
    switch(speedMode)
    {
        case 1: speedValue = Math.round(speed * 2.236936); break; 
        case 2: speedValue = Math.round(speed * 1.943844); break; 
        default: speedValue = Math.round(speed * 3.6); 
    }
    const displayValue = String(speedValue).padStart(3, '0');
    
    elements.speed.innerText = displayValue;
    elements.tabletSpeed.innerText = displayValue; // Sinkronisasi ke tablet
}

/**
 * Updates the RPM display.
 */
function setRPM(rpm) {
    const displayValue = `${Math.round(rpm * 10000)}`;
    elements.rpm.innerText = displayValue;
    elements.tabletRPM.innerText = displayValue; // Sinkronisasi ke tablet
}

/**
 * Updates the fuel level display as a percentage (number only).
 */
function setFuel(fuel) {
    const displayValue = `${Math.round(fuel * 100)}%`;
    elements.fuel.innerText = displayValue;
    elements.tabletFuel.innerText = displayValue; // Sinkronisasi ke tablet
}

/**
 * Updates the vehicle health display as a percentage (number only).
 */
function setHealth(health) {
    const displayValue = `${Math.round(health * 100)}%`;
    elements.health.innerText = displayValue;
    elements.tabletHealth.innerText = displayValue; // Sinkronisasi ke tablet
}

/**
 * Updates the current gear display.
 */
function setGear(gear) {
    let gearText = 'N';
    if (gear > 0) {
        gearText = String(gear);
    } else if (gear < 0) {
        gearText = 'R';
    }
    elements.gear.innerText = gearText;
    elements.tabletGear.innerText = gearText; // Sinkronisasi ke tablet
}

/**
 * Updates the headlights status display and icon.
 */
function setHeadlights(state) {
    toggleActive([elements.headlightsIcon, elements.tabletHeadlightsIcon], state > 0);
}

/**
 * Updates the seatbelt status display and icon.
 */
function setSeatbelts(state) {
    toggleActive([elements.seatbeltIcon, elements.tabletSeatbeltIcon], state);
}

/**
 * Sets the speed display mode and updates the speed unit display.
 */
function setSpeedMode(mode) {
    speedMode = mode;
    let unit = 'KMH';
    switch(mode)
    {
        case 1: unit = 'MPH'; break;
        case 2: unit = 'Knots'; break;
    }
    elements.speedMode.innerText = unit;
    elements.tabletSpeedMode.innerText = unit; // Sinkronisasi ke tablet
}

/**
 * Updates the time display to current WIB.
 */
function updateTimeWIB() {
    const now = new Date();
    const options = {
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false, 
        timeZone: 'Asia/Jakarta' 
    };
    
    let timeString;
    try {
        timeString = now.toLocaleTimeString('en-US', options);
    } catch (e) {
        timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    elements.timeWIB.innerText = timeString;
    elements.tabletTimeWIB.innerText = timeString; // Sinkronisasi ke tablet
}

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'), // ID baru
        headunitFooter: document.getElementById('headunit-footer'),
        tabletUI: document.getElementById('tablet-ui'),
        
        // Speedometer Elements (Main)
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        timeWIB: document.getElementById('time-wib'), 
        gear: document.getElementById('gear'),
        speedMode: document.getElementById('speed-mode'),

        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'),
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        
        // Tablet Elements (BARU)
        tabletSpeed: document.getElementById('tablet-speed'),
        tabletRPM: document.getElementById('tablet-rpm'),
        tabletFuel: document.getElementById('tablet-fuel'),
        tabletHealth: document.getElementById('tablet-health'),
        tabletTimeWIB: document.getElementById('tablet-time-wib'),
        tabletGear: document.getElementById('tablet-gear'),
        tabletSpeedMode: document.getElementById('tablet-speed-mode'),

        tabletHeadlightsIcon: document.getElementById('tablet-headlights-icon'),
        tabletEngineIcon: document.getElementById('tablet-engine-icon'),
        tabletSeatbeltIcon: document.getElementById('tablet-seatbelt-icon'),
        
        tabletCloseTrigger: document.getElementById('tablet-close-trigger'),
    };
    
    // --- SETUP WIB ---
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // --- SETUP INTERAKSI CLICK ---
    // 1. Pemicu Buka: Klik pada footer bar
    elements.headunitFooter.addEventListener('click', () => {
        toggleHeadUnit(true); // Buka tablet
    });
    
    // 2. Pemicu Tutup: Klik pada footer di dalam tablet
    elements.tabletCloseTrigger.addEventListener('click', () => {
        toggleHeadUnit(false); // Tutup tablet
    });
    
    // 3. Pemicu Tutup: Tombol ESCAPE
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Hanya tutup jika tablet sedang terbuka
            if (!elements.tabletUI.classList.contains('hidden')) {
                toggleHeadUnit(false);
            }
        }
    });

    // Initial setup and example values 
    setSpeedMode(1); 
    setEngine(true);
    setSpeed(22.35); // Approx 50 MPH
    setRPM(0.5821);
    setFuel(0.49);
    setHealth(1.0); 
    setGear(2);
    setHeadlights(1);
    setSeatbelts(true);
});

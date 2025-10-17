let elements = {};
let speedMode = 1; 

/**
 * Helper function for toggling the 'active' class on elements.
 */
const toggleActive = (element, state) => {
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

// --- FUNGSI PEMBARUAN DATA SPEEDOMETER ---

function setSpeedMode(mode) {
    speedMode = mode;
    let unit = 'KMH';
    switch(mode)
    {
        case 1: unit = 'MPH'; break;
        case 2: unit = 'Knots'; break;
    }
    elements.speedMode.innerText = unit;
}

function setSpeed(speed) {
    let speedValue;
    // Konversi dari m/s (asumsi default) ke unit yang dipilih
    switch(speedMode)
    {
        case 1: speedValue = Math.round(speed * 2.236936); break; // MPH
        case 2: speedValue = Math.round(speed * 1.943844); break; // Knots
        default: speedValue = Math.round(speed * 3.6); // KMH
    }
    const displayValue = String(speedValue).padStart(3, '0');
    elements.speed.innerText = displayValue;
}

function setRPM(rpm) {
    // rpm adalah nilai normal (0.0 - 1.0)
    const displayValue = `${Math.round(rpm * 10000)}`;
    elements.rpm.innerText = displayValue;
}

function setFuel(fuel) {
    // fuel adalah nilai normal (0.0 - 1.0)
    const displayValue = `${Math.round(fuel * 100)}%`;
    elements.fuel.innerText = displayValue;
}

function setHealth(health) {
    // health adalah nilai normal (0.0 - 1.0)
    const displayValue = `${Math.round(health * 100)}%`;
    elements.health.innerText = displayValue;
}

function setGear(gear) {
    let gearText = 'N';
    if (gear > 0) {
        gearText = String(gear);
    } else if (gear < 0) {
        gearText = 'R';
    }
    elements.gear.innerText = gearText;
}

function setHeadlights(state) {
    // state: 0 (Off), 1 (Low Beam), 2 (High Beam)
    toggleActive(elements.headlightsIcon, state > 0);
}

function setEngine(state) {
    // state: true/false
    toggleActive(elements.engineIcon, state);
}

function setSeatbelts(state) {
    // state: true/false
    toggleActive(elements.seatbeltIcon, state);
}

function updateTimeWIB() {
    const now = new Date();
    const options = {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' 
    };
    
    let timeString;
    try {
        timeString = now.toLocaleTimeString('en-US', options);
    } catch (e) {
        timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    elements.timeWIB.innerText = timeString;
}


// --- FUNGSI HEAD UNIT (LOGIC INTERAKSI) ---

/**
 * Toggles the visibility and "expand up" animation of the Head Unit/Tablet UI.
 * Speedometer TIDAK disembunyikan.
 */
function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footerTrigger = elements.headunitFooter;
    
    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        // OPEN Tablet
        tablet.classList.remove('hidden');
        footerTrigger.style.display = 'none'; 

        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
    } else {
        // CLOSE Tablet
        tablet.classList.remove('active'); 
        
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            footerTrigger.style.display = 'block'; 
        }, transitionDuration); 
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'), 
        headunitFooter: document.getElementById('headunit-footer'), 
        tabletUI: document.getElementById('tablet-ui'),
        
        // Visible Elements (Speedometer)
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
        
        // Tablet Close Element
        closeTablet: document.getElementById('close-tablet'),
    };
    
    // 1. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 2. SETUP INTERAKSI CLICK HEAD UNIT
    elements.headunitFooter.addEventListener('click', () => {
        toggleHeadUnit(true); 
    });
    
    elements.closeTablet.addEventListener('click', () => {
        toggleHeadUnit(false); 
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.tabletUI.classList.contains('hidden')) {
            toggleHeadUnit(false);
        }
    });

    // 3. INISIASI DATA SPEEDOMETER (PENTING AGAR BERFUNGSI)
    
    // Data Simulasi
    const initialSpeed = 22.35; // ~50 MPH
    const initialRPM = 0.5821;
    const initialFuel = 0.49;
    const initialHealth = 1.0;
    const initialGear = 2;
    const headlightsState = 1;
    const engineOn = true;
    const seatbeltFastened = true;
    
    setSpeedMode(1); // Set ke MPH
    setSpeed(initialSpeed); 
    setRPM(initialRPM);
    setFuel(initialFuel);
    setHealth(initialHealth); 
    setGear(initialGear);
    setHeadlights(headlightsState);
    setEngine(engineOn);
    setSeatbelts(seatbeltFastened);
    
    // Simulasi Perubahan Data (Contoh: setiap 3 detik)
    let currentSpeed = initialSpeed;
    setInterval(() => {
        // Simulasi peningkatan kecepatan kecil
        currentSpeed = Math.min(25, currentSpeed + (Math.random() - 0.5) * 0.5); 
        setSpeed(currentSpeed);
        
        // Simulasi RPM
        const currentRPM = Math.max(0.1, Math.min(0.9, initialRPM + (Math.random() - 0.5) * 0.05));
        setRPM(currentRPM);
        
        // Simulasi Gear (berganti antara 2 dan 3)
        if (currentSpeed > 20 && Math.random() < 0.1) {
            setGear(3);
        } else if (currentSpeed < 10 && Math.random() < 0.1) {
            setGear(1);
        } else {
            setGear(2);
        }
    }, 3000); // Update setiap 3 detik
});

let elements = {};
let speedMode = 1; 
let indicators = 0; 

const onOrOff = state => state ? 'On' : 'Off';

// Helper function for toggling active state
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

/**
 * Toggles the visibility of the Head Unit/Tablet UI.
 */
function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const mediaButton = elements.mediaButton;
    
    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        // OPEN Tablet
        tablet.classList.remove('hidden');
        mediaButton.classList.add('hidden'); // Sembunyikan tombol media saat tablet terbuka
        console.log(`[HEAD UNIT] Status: OPENED (Speedometer Tetap Aktif)`);
    } else {
        // CLOSE Tablet
        tablet.classList.add('hidden');
        mediaButton.classList.remove('hidden'); // Tampilkan tombol media
        console.log(`[HEAD UNIT] Status: CLOSED`);
    }
}

/**
 * Updates the display of the engine state and its icon.
 */
function setEngine(state) {
    toggleActive([elements.engineIcon, elements.tabletEngineIcon], state);
}
// ... (Semua fungsi setSpeed, setRPM, setFuel, setHealth, setGear, setHeadlights, setSeatbelts, setSpeedMode, dan updateTimeWIB) harus diperbarui untuk sinkronisasi data ke elemen tablet yang baru.

// Hanya menampilkan fungsi set yang penting untuk sinkronisasi
function setSpeed(speed) {
    let speedValue;
    switch(speedMode) {
        case 1: speedValue = Math.round(speed * 2.236936); break; 
        default: speedValue = Math.round(speed * 3.6); 
    }
    const displayValue = String(speedValue).padStart(3, '0');
    
    elements.speed.innerText = displayValue;
    if (elements.tabletSpeed) elements.tabletSpeed.innerText = displayValue;
}

function setRPM(rpm) {
    const displayValue = `${Math.round(rpm * 10000)}`;
    elements.rpm.innerText = displayValue;
    if (elements.tabletRPM) elements.tabletRPM.innerText = displayValue;
}

function updateTimeWIB() {
    // ... (logic waktu WIB)
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
    if (elements.tabletTimeWIB) elements.tabletTimeWIB.innerText = timeString;
}


// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'),
        mediaButton: document.getElementById('media-button'),
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
        
        // Tablet Elements (Pastikan semua elemen statistik terdaftar)
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

        // Tablet Close Element
        closeTablet: document.getElementById('close-tablet'),
    };
    
    // --- SETUP WIB ---
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // --- SETUP INTERAKSI CLICK ---
    elements.mediaButton.addEventListener('click', () => {
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

    // Initial setup and example values 
    // Anda perlu memanggil semua fungsi set agar data disinkronkan ke tablet
    // Contoh: setFuel(0.49); setRPM(0.5821); setHeadlights(1);
    
});

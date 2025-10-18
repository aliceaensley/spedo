let elements = {};
let speedMode = 1;
let indicators = 0;
let engineState = false; // Tambahkan state untuk engine
let seatbeltState = false; // Tambahkan state untuk seatbelt

const onOrOff = state => state ? 'On' : 'Off';

// --- FUNGSI UTILITY BARU ---

/**
 * Toggles the 'active' class on an element (for icons).
 * @param {HTMLElement} element - The element to toggle.
 * @param {boolean} state - The desired state.
 */
const toggleIconActive = (element, state) => {
    if (element) {
        element.classList.toggle('active', state);
    }
};

/**
 * Updates the time display (HH:MM).
 */
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    if (elements.time) {
        elements.time.innerText = `${hours}:${minutes}`;
    }
}

// --- FUNGSI PEMBARUAN DATA ---

/**
 * Updates the display of the engine state.
 * @param {boolean} state If true, the engine is on; otherwise, it is off.
 */
function setEngine(state) {
    engineState = state;
    // Update ikon mesin
    toggleIconActive(elements.engineIcon, state);
    // Kita tidak menampilkan teks 'On/Off' di UI baru, cukup ikon
}

/**
 * Updates the speed display based on the current speed mode.
 * @param {number} speed - The speed value in meters per second (m/s).
 */
function setSpeed(speed) {
    let speedValue;
    const absSpeed = Math.abs(speed); 
    
    switch(speedMode)
    {
        case 1: speedValue = Math.round(absSpeed * 2.236936); break; // MPH
        case 2: speedValue = Math.round(absSpeed * 1.943844); break; // Knots
        default: speedValue = Math.round(absSpeed * 3.6); // KMH
    }
    
    // Speed selalu ditampilkan 3 digit
    const displayValue = String(speedValue).padStart(3, '0');
    if (elements.speed) elements.speed.innerText = displayValue;
}

/**
 * Updates the RPM (Revolutions Per Minute) display.
 * @param {number} rpm - The RPM value to display. (0 to 1).
 */
function setRPM(rpm) {
    // RPM ditampilkan sebagai nilai 4 digit di kotak kecil
    const rpmValue = Math.round(rpm * 10000);
    elements.rpm.innerText = `${rpmValue} RPM`;
}

/**
 * Updates the fuel level display as a percentage.
 * @param {number} fuel - The fuel level (0 to 1).
 */
function setFuel(fuel) {
    elements.fuel.innerText = `${(fuel * 100).toFixed(1)}%`;
}

/**
 * Updates the vehicle health display as a percentage.
 * @param {number} health - The vehicle health level (0 to 1).
 */
function setHealth(health) {
    elements.health.innerText = `${(health * 100).toFixed(1)}%`;
}

/**
 * Updates the current gear display (menggunakan ikon gear di bar).
 * @param {number} gear - The current gear to display. 0 represents neutral/reverse.
 */
function setGear(gear) {
    let gearText;
    if (gear === 0) {
        gearText = 'N';
    } else if (gear < 0) {
        gearText = 'R';
    } else {
        gearText = String(gear);
    }
    
    if (elements.gearDisplay) elements.gearDisplay.innerText = gearText;
}

/**
 * Updates the headlights status display (menggunakan ikon lampu).
 * @param {number} state - The headlight state (0: Off, 1: On, 2: High Beam).
 */
function setHeadlights(state) {
    const isActive = (state > 0);
    toggleIconActive(elements.headlightsIcon, isActive);
}

/**
 * Sets the state of the left turn indicator and updates the display.
 */
function setLeftIndicator(state) {
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    // Ikon indikator aktif jika salah satu atau keduanya aktif
    toggleIconActive(elements.indicatorsIcon, indicators > 0);
}

/**
 * Sets the state of the right turn indicator and updates the display.
 */
function setRightIndicator(state) {
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    // Ikon indikator aktif jika salah satu atau keduanya aktif
    toggleIconActive(elements.indicatorsIcon, indicators > 0);
}

/**
 * Updates the seatbelt status display (menggunakan ikon seatbelt).
 * @param {boolean} state - If true, indicates seatbelts are fastened; otherwise, indicates they are not.
 */
function setSeatbelts(state) {
    seatbeltState = state;
    toggleIconActive(elements.seatbeltsIcon, state);
}

/**
 * Sets the speed display mode and updates the speed unit display.
 * @param {number} mode - The speed mode to set (0: KMH, 1: MPH, 2: Knots).
 */
function setSpeedMode(mode) {
    speedMode = mode;
    let unit = 'KMH';
    switch(mode)
    {
        case 1: unit = 'MPH'; break;
        case 2: unit = 'Knots'; break;
        default: unit = 'KMH';
    }
    if (elements.speedMode) elements.speedMode.innerText = unit;
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        // Data Utama
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        time: document.getElementById('time'), // BARU
        speedMode: document.getElementById('speed-mode'),
        
        // Ikon (Interaksi/Status)
        engineIcon: document.getElementById('engine-icon'), // BARU
        headlightsIcon: document.getElementById('headlights-icon'), // BARU
        seatbeltsIcon: document.getElementById('seatbelts-icon'), // BARU
        indicatorsIcon: document.getElementById('indicators-icon'), // BARU
        gearDisplay: document.getElementById('gear-display'), // BARU

        // Elemen lama yang tetap ada di HTML tapi diabaikan/disembunyikan
        engine: document.getElementById('engine'), // Dibiarkan saja
        indicators: document.getElementById('indicators'), // Dibiarkan saja
        seatbelts: document.getElementById('seatbelts'), // Dibiarkan saja
        headlights: document.getElementById('headlights'), // Dibiarkan saja
        gear: document.getElementById('gear'), // Dibiarkan saja
    };
    
    // 2. Inisiasi dan Simulasi Sederhana
    setSpeedMode(1); // Default MPH
    setEngine(false); 
    setHeadlights(0); // Off
    setSeatbelts(false); 
    setGear(0); // Neutral
    setRPM(0.10); // Nilai RPM awal rendah
    setFuel(0.49); 
    setHealth(1.0); 
    
    // Update Time setiap detik
    updateTime(); 
    setInterval(updateTime, 1000); 

    // --- LOGIC SIMULASI DASAR (Anda dapat mengganti ini dengan simulasi kompleks jika perlu) ---
    
    let currentSpeed = 0;
    
    // Set engine ON dan mulai simulasi setelah 1 detik
    setTimeout(() => {
        setEngine(true);
        currentSpeed = 1; // Mulai bergerak
        setRPM(0.20); // Naikkan RPM
        
        // Simulasi Loop
        setInterval(() => {
            // Naikkan/turunkan speed secara acak
            currentSpeed += (Math.random() - 0.5) * 2; 
            currentSpeed = Math.max(0, Math.min(100, currentSpeed)); // Batasi 0-100 m/s
            
            // Set speed dan RPM proporsional
            setSpeed(currentSpeed);
            setRPM(0.15 + (currentSpeed / 100) * 0.8);

        }, 500); // Update setiap 0.5 detik
        
    }, 1000); 

    // --- LOGIC KLIK ICON (Simulasi Toggle) ---
    if (elements.engineIcon) elements.engineIcon.addEventListener('click', () => setEngine(!engineState));
    if (elements.headlightsIcon) elements.headlightsIcon.addEventListener('click', () => setHeadlights(1));
    if (elements.seatbeltsIcon) elements.seatbeltsIcon.addEventListener('click', () => setSeatbelts(!seatbeltState));
    if (elements.indicatorsIcon) elements.indicatorsIcon.addEventListener('click', () => setLeftIndicator(true));
});

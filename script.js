let elements = {};
let speedMode = 1; // 1: MPH (default), 0: KMH, 2: Knots
let indicators = 0; 

const onOrOff = state => state ? 'On' : 'Off';

// Helper function for toggling active state
const toggleActive = (element, state) => {
    if (state) {
        element.classList.add('active');
    } else {
        element.classList.remove('active');
    }
};

/**
 * Updates the display of the engine state and its icon.
 */
function setEngine(state) {
    toggleActive(elements.engineIcon, state);
}

/**
 * Updates the speed display based on the current speed mode.
 * @param {number} speed - The speed value in meters per second (m/s).
 */
function setSpeed(speed) {
    let speedValue;
    switch(speedMode)
    {
        case 1: speedValue = Math.round(speed * 2.236936); break; // MPH
        case 2: speedValue = Math.round(speed * 1.943844); break; // Knots
        default: speedValue = Math.round(speed * 3.6); // KMH
    }
    // Format speed to at least 3 digits with leading zeros (e.g., 050, 120)
    elements.speed.innerText = String(speedValue).padStart(3, '0');
}

/**
 * Updates the RPM display.
 * @param {number} rpm - The RPM value to display. (0 to 1).
 */
function setRPM(rpm) {
    elements.rpm.innerText = `${Math.round(rpm * 10000)}`;
}

/**
 * Updates the fuel level display as a percentage (number only).
 * @param {number} fuel - The fuel level (0 to 1).
 */
function setFuel(fuel) {
    elements.fuel.innerText = `${Math.round(fuel * 100)}%`; // Tambahkan % untuk kejelasan
}

/**
 * Updates the vehicle health display as a percentage (number only).
 * @param {number} health - The vehicle health level (0 to 1).
 */
function setHealth(health) {
    elements.health.innerText = `${Math.round(health * 100)}%`; // Tambahkan % untuk kejelasan
}

/**
 * Updates the current gear display.
 * @param {number} gear - The current gear to display.
 */
function setGear(gear) {
    let gearText = 'N';
    if (gear > 0) {
        gearText = String(gear);
    } else if (gear < 0) {
        gearText = 'R';
    }
    elements.gear.innerText = gearText;
}

/**
 * Updates the headlights status display and icon.
 * @param {number} state - The headlight state (0: Off, 1: On, 2: High Beam).
 */
function setHeadlights(state) {
    toggleActive(elements.headlightsIcon, state > 0);
}

/**
 * Updates the seatbelt status display and icon.
 * @param {boolean} state - If true, indicates seatbelts are fastened.
 */
function setSeatbelts(state) {
    toggleActive(elements.seatbeltIcon, state);
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
    }
    elements.speedMode.innerText = unit;
}

/**
 * Updates the time display to current WIB (Waktu Indonesia Barat).
 */
function updateTimeWIB() {
    const now = new Date();
    // Gunakan waktu lokal dan format HH:mm
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
        // Fallback jika timeZone tidak didukung
        timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    elements.timeWIB.innerText = timeString;
}

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // Old (Hidden) elements
        engine: document.getElementById('engine'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        
        // Visible Elements
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        timeWIB: document.getElementById('time-wib'), // WIB Element
        gear: document.getElementById('gear'),
        speedMode: document.getElementById('speed-mode'),

        // Icons for bottom panel
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'),
        seatbeltIcon: document.getElementById('seatbelt-icon'),
    };
    
    // Setup Waktu WIB: Panggil sekali dan atur interval
    updateTimeWIB();
    // Update setiap 60 detik (1 menit)
    setInterval(updateTimeWIB, 60000); 
    
    // Initial setup and example values (for testing purposes)
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

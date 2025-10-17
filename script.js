let elements = {};
let speedMode = 1; // 1: MPH (default), 0: KMH, 2: Knots
let indicators = 0; 

const onOrOff = state => state ? 'On' : 'Off';

// Helper function for toggling active state
const toggleActive = (element, state) => {
    // Diperbarui untuk hanya menerima satu elemen (karena elemen tablet sudah dihapus)
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
}

/**
 * Updates the RPM display.
 */
function setRPM(rpm) {
    const displayValue = `${Math.round(rpm * 10000)}`;
    elements.rpm.innerText = displayValue;
}

/**
 * Updates the fuel level display as a percentage (number only).
 */
function setFuel(fuel) {
    const displayValue = `${Math.round(fuel * 100)}%`;
    elements.fuel.innerText = displayValue;
}

/**
 * Updates the vehicle health display as a percentage (number only).
 */
function setHealth(health) {
    const displayValue = `${Math.round(health * 100)}%`;
    elements.health.innerText = displayValue;
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
}

/**
 * Updates the headlights status display and icon.
 */
function setHeadlights(state) {
    toggleActive(elements.headlightsIcon, state > 0);
}

/**
 * Updates the seatbelt status display and icon.
 */
function setSeatbelts(state) {
    toggleActive(elements.seatbeltIcon, state);
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
}

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'),
        
        // Visible Elements
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
    };
    
    // --- SETUP WIB ---
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
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

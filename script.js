let elements = {};
let speedMode = 1; // 1: MPH (default), 0: KMH, 2: Knots
let indicators = 0; // 0b00: Off, 0b01: Left On, 0b10: Right On, 0b11: Both On

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
 * @param {boolean} state - If true, the engine is on; otherwise, it is off.
 */
function setEngine(state) {
    // Hidden: elements.engine.innerText = onOrOff(state);
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
    // Assuming 0-1 RPM is converted to a value like 5821 as seen in the image (e.g., * 10000)
    elements.rpm.innerText = `${Math.round(rpm * 10000)}`;
}

/**
 * Updates the fuel level display as a percentage.
 * @param {number} fuel - The fuel level (0 to 1).
 */
function setFuel(fuel) {
    // Assuming we only show the percentage number, not the % sign, based on image
    elements.fuel.innerText = `${Math.round(fuel * 100)}`;
}

/**
 * Updates the vehicle health display as a percentage.
 * @param {number} health - The vehicle health level (0 to 1).
 */
function setHealth(health) {
    // Health is for the player's health, assumed 100% in image
    elements.health.innerText = `${Math.round(health * 100)}`;
    // We'll use this function to also set the V.Out (vehicle damage)
    let damage = 1 - health; // Damage is inverse of health
    elements.vehicleDamage.innerText = `${Math.round(damage * 100)}`;
}

/**
 * Updates the current gear display.
 * @param {number} gear - The current gear to display. 0 represents neutral/reverse.
 */
function setGear(gear) {
    // Use 'R' for reverse (-1) and 'N' for neutral (0) if applicable, otherwise use the number
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
    // Hidden: elements.headlights.innerText = state === 2 ? 'High Beam' : (state === 1 ? 'On' : 'Off');
    toggleActive(elements.headlightsIcon, state > 0);
    // You might want to change the icon color for High Beam (state === 2)
}

/**
 * Sets the state of the left turn indicator and updates the display.
 * @param {boolean} state - If true, turns the left indicator on; otherwise, turns it off.
 */
function setLeftIndicator(state) {
    // Indicators are now hidden but the logic remains for internal use if needed
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    // Hidden: elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
}

/**
 * Sets the state of the right turn indicator and updates the display.
 * @param {boolean} state - If true, turns the right indicator on; otherwise, turns it off.
 */
function setRightIndicator(state) {
    // Indicators are now hidden but the logic remains for internal use if needed
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    // Hidden: elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
}

/**
 * Updates the seatbelt status display and icon.
 * @param {boolean} state - If true, indicates seatbelts are fastened; otherwise, indicates they are not.
 */
function setSeatbelts(state) {
    // Hidden: elements.seatbelts.innerText = onOrOff(state);
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

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // Old elements (kept for function compatibility, but visually hidden)
        engine: document.getElementById('engine'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        
        // New/Visible Elements
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        vehicleDamage: document.getElementById('vehicle-damage'), // The 'V.Out' stat
        gear: document.getElementById('gear'),
        speedMode: document.getElementById('speed-mode'),

        // Icons for bottom panel
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'),
        seatbeltIcon: document.getElementById('seatbelt-icon'),
    };
    
    // Initial setup and example values (for testing purposes)
    setSpeedMode(1); // Set to MPH
    setEngine(true);
    setSpeed(22.35); // Example: 22.35 m/s is approx 50 MPH
    setRPM(0.5821);
    setFuel(0.49);
    setHealth(1.0); // Full health/No damage
    setGear(2);
    setHeadlights(1); // On
    setSeatbelts(true);
});

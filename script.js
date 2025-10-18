let elements = {};
let speedMode = 0; // Default ke KMH (diatur 0: KMH, 1: MPH, 2: Knots)
let engineState = false; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 
let vitalInterval = null; 
let isVehicleIdle = false; 

// *****************************************************************
// Fitur Audio, YouTube, dan Clock Dihapus / Dinonaktifkan sementara
// Karena tidak ada elemen HTML pendukung di template baru.
// Hanya logika Speed/RPM/Engine yang dipertahankan.
// *****************************************************************

// ✅ AUDIO FILES (Dipertahankan untuk fitur Seatbelts)
const seatbeltSound = new Audio('ahh.mp3'); 

const IDLE_RPM_VALUE = 0.16; // 1600 RPM
const IDLE_TOLERANCE_MS = 0.2; // Batas kecepatan di mana simulasi dianggap bergerak (m/s)

const onOrOff = state => state ? 'On' : 'Off';

// --- FUNGSI PEMBARUAN DATA SPEEDOMETER ---

/**
 * Updates the display of the engine state.
 * @param {boolean} state If true, the engine is on; otherwise, it is off.
 */
function setEngine(state) {
    if (engineState !== state) {
        engineState = state;
        if (elements.engine) elements.engine.innerText = onOrOff(state);
        
        if (state) {
            startSimulation(); 
        } else {
            stopSimulation(); 
        }
    }
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
    
    // Output disesuaikan dengan template baru (menghilangkan padding '000' dan unit di fungsi ini)
    if (elements.speed) elements.speed.innerText = `${speedValue}`; 
}

/**
 * Updates the RPM (Revolutions Per Minute) display.
 * @param {number} rpm - The RPM value to display. (0.0 to 1.0).
 */
function setRPM(rpm) {
    // rpm dikonversi ke nilai 4 digit (misal: 0.16 -> 1600, 0.5 -> 5000)
    const displayValue = `${Math.round(rpm * 10000)}`; 
    
    // Output disesuaikan dengan template baru
    if (elements.rpm) elements.rpm.innerText = displayValue;
}

/**
 * Updates the fuel level display as a percentage.
 * @param {number} fuel - The fuel level (0 to 1).
 */
function setFuel(fuel) {
    if (elements.fuel) elements.fuel.innerText = `${(fuel * 100).toFixed(1)}%`;
}

/**
 * Updates the vehicle health display as a percentage.
 * @param {number} health - The vehicle health level (0 to 1).
 */
function setHealth(health) {
    if (elements.health) elements.health.innerText = `${(health * 100).toFixed(1)}%`;
}

/**
 * Updates the current gear display.
 * @param {number} gear - The current gear to display. 0 represents neutral/reverse.
 */
function setGear(gear) {
    if (elements.gear) elements.gear.innerText = String(gear);
}

/**
 * Updates the headlights status display.
 * @param {number} state - The headlight state (0: Off, 1: On, 2: High Beam).
 */
function setHeadlights(state) {
    headlightsState = state;
    let text = 'Off';
    if (state === 1) text = 'On';
    if (state === 2) text = 'High Beam';
    if (elements.headlights) elements.headlights.innerText = text;
}

/**
 * Sets the state of the left turn indicator and updates the display.
 * @param {boolean} state - If true, turns the left indicator on; otherwise, turns it off.
 */
function setLeftIndicator(state) {
    // Logika Indicators dipertahankan dari template baru
    // ...
}

/**
 * Sets the state of the right turn indicator and updates the display.
 * @param {boolean} state - If true, turns the right indicator on; otherwise, turns it off.
 */
function setRightIndicator(state) {
    // Logika Indicators dipertahankan dari template baru
    // ...
}

/**
 * Updates the seatbelt status display.
 * @param {boolean} state - If true, indicates seatbelts are fastened; otherwise, indicates they are not.
 */
function setSeatbelts(state) {
    // Logika Suara Seatbelt: Putar ahh.mp3 jika sabuk baru dipasang (dari false ke true)
    if (state === true && seatbeltState === false) {
        seatbeltSound.currentTime = 0;
        // Handle error autoplay di browser
        seatbeltSound.play().catch(e => { console.warn("Gagal memutar ahh.mp3:", e); });
    }

    seatbeltState = state;
    if (elements.seatbelts) elements.seatbelts.innerText = onOrOff(state);
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


// --- FUNGSI KONTROL SIMULASI BERKENDARA ---

function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    setSpeed(0);
    // Atur RPM ke 0000 saat mesin dimatikan
    if (elements.rpm) elements.rpm.innerText = '0000'; 
    isVehicleIdle = false; 
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    
    let accelerationRate = 0.5; 
    let decelerationRate = 0.1; 

    // Set nilai awal idle (0 dan 1600)
    setSpeed(0);
    if (elements.rpm) elements.rpm.innerText = '1600'; 

    simulationInterval = setInterval(() => {
        
        let targetSpeedChange = 0;
        let action = Math.random();
        
        if (action < 0.5) { 
            // 50%: Akselerasi/Tambah kecepatan
            targetSpeedChange = accelerationRate * Math.random(); 
        } else if (action < 0.8) { 
            // 30%: Deselerasi/Rem
            targetSpeedChange = -decelerationRate * Math.random() * 2; 
        } else {
            // 20%: Cruising
            targetSpeedChange = (Math.random() - 0.5) * 0.1;
        }

        currentSpeed += targetSpeedChange;
        
        // Perlambatan alami (Drag)
        if (targetSpeedChange < 0.1 && currentSpeed > 0) {
            currentSpeed *= 0.98; 
        }

        // Jika kecepatan sangat rendah, paksa ke 0 (Idle)
        if (currentSpeed < IDLE_TOLERANCE_MS) { 
            currentSpeed = 0; 
        } 
        
        currentSpeed = Math.max(0, currentSpeed);
        
        // Cek status Idle
        isVehicleIdle = (currentSpeed === 0);
        
        if (isVehicleIdle) {
            // ✅ Kunci Nilai: Jika idle, Speed = 0, RPM = 1600 (STABIL)
            setSpeed(0);
            if (elements.rpm) elements.rpm.innerText = '1600'; 
        } else {
            // ✅ Simulasi normal jika bergerak
            setSpeed(currentSpeed); 
            
            const absSpeed = Math.abs(currentSpeed);
            
            // Logika RPM (Proporsional dengan Speed)
            let baseRPM = IDLE_RPM_VALUE + (absSpeed * 0.007);
            
            let currentRPM = Math.min(0.99, baseRPM);
            
            // Tambahkan sedikit noise hanya saat bergerak
            currentRPM += (Math.random() - 0.5) * 0.02; 
            
            setRPM(currentRPM);
        }
        
    }, 100); 
}


// --- FUNGSI KONTROL DATA VITAL (MINIMAL) ---

function startVitalUpdates() {
    if (vitalInterval !== null) return;
    
    // Inisiasi nilai awal Fuel dan Health
    if (elements.health) setHealth(1.0); 
    if (elements.fuel) setFuel(0.49); 

    vitalInterval = setInterval(() => {
        // Karena tidak ada UI untuk Vital, fungsi ini hanya menjaga simulasi dasar
        // Di sini bisa ditambahkan logika pengurangan Fuel jika diperlukan
        
    }, 10000); 
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen (Berdasarkan template HTML baru)
    elements = {
        engine: document.getElementById('engine'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        speedMode: document.getElementById('speed-mode'),
    };
    
    // 2. INISIASI DATA AWAL
    setSpeedMode(0); // Default KMH
    setEngine(false); 
    setHeadlights(1); // On
    setSeatbelts(true);
    setGear(0); // Neutral

    if (elements.health) setHealth(1.0); 
    if (elements.fuel) setFuel(0.49); 

    startVitalUpdates(); 

    // 3. LOGIC SIMULASI
    // Nyalakan mesin setelah 1 detik untuk memulai simulasi
    setTimeout(() => {
        setEngine(true);
    }, 1000);
});

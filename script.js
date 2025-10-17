let elements = {};
let speedMode = 0; // Default KMH (0: KMH, 1: MPH, 2: Knots)

// --- Konstan NUI ---
const MAX_RPM = 8000;
const MAX_RPM_ANGLE = 270; // Sudut putaran ring luar
const RPM_RING_START_DEG = 45; // Sudut awal ring (bawah-kiri)

/**
 * Mengambil referensi elemen DOM baru.
 */
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        speedValue: document.getElementById('speed-value'),
        speedUnit: document.getElementById('speed-unit'),
        rpmRingFill: document.getElementById('rpm-ring-fill'),
        fuelBarFill: document.getElementById('fuel-bar-fill'),
        healthBarFill: document.getElementById('health-bar-fill'),
        gearValue: document.getElementById('gear-value'),
        headlightsIcon: document.getElementById('headlights-icon'),
        seatbeltsIcon: document.getElementById('seatbelts-icon'),
        leftIndicatorIcon: document.getElementById('left-indicator-icon'),
        rightIndicatorIcon: document.getElementById('right-indicator-icon'),
        speedModeText: document.getElementById('speed-unit'), // Menggunakan elemen unit untuk mode
        speedoContainer: document.getElementById('speedometer-container'),
    };
    // Inisialisasi unit kecepatan
    setSpeedMode(speedMode); 
});


/**
 * Mengubah state On/Off menjadi class CSS.
 * @param {HTMLElement} element - Elemen yang akan diubah.
 * @param {boolean} state - True untuk 'on', False untuk 'off'.
 */
const setVisualState = (element, state) => {
    if (state) {
        element.classList.remove('off');
        element.classList.add('on');
    } else {
        element.classList.remove('on');
        element.classList.add('off');
    }
};

/**
 * Updates the speed display based on the current speed mode.
 * @param {number} speed - The speed value in meters per second (m/s).
 */
function setSpeed(speed) {
    let displaySpeed;
    
    // Konversi dan Tampilkan Kecepatan
    switch(speedMode)
    {
        case 1: displaySpeed = Math.round(speed * 2.236936); break; // MPH
        case 2: displaySpeed = Math.round(speed * 1.943844); break; // Knots
        default: displaySpeed = Math.round(speed * 3.6); // KMH
    }
    elements.speedValue.innerText = String(displaySpeed).padStart(3, '0');
}

/**
 * Updates the RPM Ring (Gauge) display.
 * @param {number} rpm - The RPM value (0.0 to 1.0).
 */
function setRPM(rpm) {
    // Hitung sudut putaran
    const rotationDegrees = RPM_RING_START_DEG + (rpm * MAX_RPM_ANGLE);
    elements.rpmRingFill.style.transform = `rotate(${rotationDegrees}deg)`;
    
    // Logika pewarnaan Redline
    const rpmValue = rpm * MAX_RPM;
    let borderColor = '#00bcd4'; 
    let filterDropShadow = 'drop-shadow(0 0 7px #00bcd4)';

    if (rpmValue > 7000) {
        borderColor = '#ff5252'; // Redline
        filterDropShadow = 'drop-shadow(0 0 10px #ff5252)';
    } else if (rpmValue > 5000) {
        borderColor = '#FFC107'; // Warning
        filterDropShadow = 'drop-shadow(0 0 8px #FFC107)';
    }

    elements.rpmRingFill.style.borderColor = borderColor;
    elements.rpmRingFill.style.filter = filterDropShadow;
}

/**
 * Updates the fuel level bar.
 * @param {number} fuel - The fuel level (0.0 to 1.0).
 */
function setFuel(fuel) {
    const percentage = fuel * 100;
    elements.fuelBarFill.style.width = `${percentage}%`;
    
    // Ubah warna bar status
    let color = '#4CAF50';
    if (percentage < 20) {
        color = '#ff5252'; // Merah (Low Fuel)
    } else if (percentage < 50) {
        color = '#FFC107'; // Kuning
    }
    elements.fuelBarFill.style.backgroundColor = color;
}

/**
 * Updates the vehicle health bar.
 * @param {number} health - The vehicle health level (0.0 to 1.0).
 */
function setHealth(health) {
    const percentage = health * 100;
    elements.healthBarFill.style.width = `${percentage}%`;
    
    // Ubah warna bar status
    let color = '#00bcd4';
    if (percentage < 20) {
        color = '#ff5252'; // Merah (Engine rusak parah)
    } else if (percentage < 50) {
        color = '#FFC107'; // Kuning
    }
    elements.healthBarFill.style.backgroundColor = color;
}

/**
 * Updates the current gear display.
 * @param {number} gear - The current gear. 0 represents neutral/reverse.
 */
function setGear(gear) {
    elements.gearValue.innerText = gear === 0 ? 'N' : String(gear);
}

/**
 * Updates the headlights icon status.
 * @param {number} state - The headlight state (0: Off, 1: On, 2: High Beam).
 */
function setHeadlights(state) {
    const isOn = state > 0;
    setVisualState(elements.headlightsIcon, isOn);
    // Ubah ikon untuk High Beam jika perlu
    elements.headlightsIcon.innerText = state === 2 ? '🔦' : '💡'; 
}

/**
 * Menghandle animasi berkedip untuk indikator.
 * @param {boolean} leftState - Status indikator kiri.
 * @param {boolean} rightState - Status indikator kanan.
 */
function updateIndicators(leftState, rightState) {
    const leftIcon = elements.leftIndicatorIcon;
    const rightIcon = elements.rightIndicatorIcon;
    
    // Hapus/Tambahkan animasi kedip (blinking)
    leftIcon.classList.toggle('blinking', leftState);
    rightIcon.classList.toggle('blinking', rightState);
}

/**
 * Updates the seatbelt icon status.
 * @param {boolean} state - If true, indicates seatbelts are fastened.
 */
function setSeatbelts(state) {
    setVisualState(elements.seatbeltsIcon, state);
}

/**
 * Sets the speed display mode and updates the speed unit display.
 * @param {number} mode - The speed mode to set (0: KMH, 1: MPH, 2: Knots).
 */
function setSpeedMode(mode) {
    speedMode = mode;
    let unit;
    switch(mode)
    {
        case 1: unit = 'MPH'; break;
        case 2: unit = 'KNOTS'; break;
        default: unit = 'KMH';
    }
    elements.speedUnit.innerText = unit;
}

// =========================================================================
// FIVE-M NUI INTERFACE: Menerima data dari client.lua
// =========================================================================
window.addEventListener('message', (event) => {
    const data = event.data;
    
    // Cek apakah resource game sedang di kendaraan
    if (data.inVehicle) {
        elements.speedoContainer.style.display = 'flex'; // Tampilkan HUD
        
        // Panggil fungsi pembaruan utama
        if (data.speed !== undefined) setSpeed(data.speed); 
        if (data.rpm !== undefined) setRPM(data.rpm);
        if (data.fuel !== undefined) setFuel(data.fuel);
        if (data.health !== undefined) setHealth(data.health);
        if (data.gear !== undefined) setGear(data.gear);
        if (data.headlights !== undefined) setHeadlights(data.headlights);
        if (data.seatbelts !== undefined) setSeatbelts(data.seatbelts);
        
        // Data indicator dipecah dari data aslinya, kita harus menggabungkannya
        const leftIndicatorState = data.indicators & 0b01;
        const rightIndicatorState = data.indicators & 0b10;
        updateIndicators(leftIndicatorState, rightIndicatorState);
        
        // Engine status: Asumsi engine mati jika RPM 0 dan Speed 0, 
        // atau jika ada field 'engineOn' dari resource game yang kita tidak lihat
        // Tapi kita tidak bisa update engine di sini tanpa data dari game

    } else {
        elements.speedoContainer.style.display = 'none'; // Sembunyikan HUD
    }

    // Handle Speed Mode Update jika ada event khusus dari game
    if (data.speedMode !== undefined) {
        setSpeedMode(data.speedMode);
    }
});

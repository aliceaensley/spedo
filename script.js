// VARIABEL ASLI ANDA
let elements = {};
let speedMode = 1; // Default di kode asli Anda
let indicators = 0;

const onOrOff = state => state ? 'On' : 'Off';

// --- FUNGSI ASLI ANDA (Dimodifikasi hanya untuk memperbarui tampilan baru) ---

function setEngine(state) {
    // Memperbarui elemen tersembunyi (untuk kompatibilitas)
    elements.engine.innerText = onOrOff(state);
    
    // Memperbarui indikator Engine On/Off (Kita buat elemen baru)
    const engineText = document.getElementById('engine-status') || document.createElement('span');
    engineText.id = 'engine-status';
    engineText.innerText = state ? 'ENGINE ON' : 'ENGINE OFF';
    engineText.className = state ? 'EngineOn' : 'EngineOff';

    // Tambahkan elemen jika belum ada
    if (!document.getElementById('engine-status')) {
        document.getElementById('indicators-wrapper').prepend(engineText);
    }
}

function setSpeed(speed) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #speed
    let calculatedSpeed;
    switch(speedMode)
    {
        case 1: calculatedSpeed = Math.round(speed * 2.236936); break; // MPH
        case 2: calculatedSpeed = Math.round(speed * 1.943844); break; // Knots
        default: calculatedSpeed = Math.round(speed * 3.6); // KMH
    }
    elements.speed.innerText = `${calculatedSpeed} ${elements.speedUnit.innerText}`;

    // TAMPILAN BARU: Memperbarui nilai besar
    elements.speedValue.innerText = String(calculatedSpeed).padStart(3, '0');
}

function setRPM(rpm) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #rpm
    elements.rpm.innerText = `${rpm.toFixed(4)} RPM`;

    // TAMPILAN BARU: Memperbarui nilai RPM yang terlihat
    elements.rpmValue.innerText = rpm.toFixed(4);
}

function setFuel(fuel) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #fuel
    const percentage = (fuel * 100).toFixed(1);
    elements.fuel.innerText = `${percentage}%`;

    // TAMPILAN BARU: Memperbarui bar fill
    elements.fuelBarFill.style.width = `${percentage}%`;
    let color = '#4CAF50';
    if (percentage < 20) {
        color = '#ff5252'; 
    } else if (percentage < 50) {
        color = '#FFC107'; 
    }
    elements.fuelBarFill.style.backgroundColor = color;
}

function setHealth(health) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #health
    const percentage = (health * 100).toFixed(1);
    elements.health.innerText = `${percentage}%`;
    
    // TAMPILAN BARU: Memperbarui bar fill
    elements.healthBarFill.style.width = `${percentage}%`;
    let color = '#00bcd4';
    if (percentage < 20) {
        color = '#ff5252'; 
    } else if (percentage < 50) {
        color = '#FFC107'; 
    }
    elements.healthBarFill.style.backgroundColor = color;
}

function setGear(gear) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #gear
    elements.gear.innerText = String(gear);

    // TAMPILAN BARU: Memperbarui nilai besar
    elements.gearValue.innerText = gear === 0 ? 'N' : String(gear);
}

function setHeadlights(state) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #headlights
    let textState = 'Off';
    if (state === 1) textState = 'On';
    if (state === 2) textState = 'High Beam';
    elements.headlights.innerText = textState;

    // TAMPILAN BARU: Memperbarui teks indikator
    elements.headlightsText.innerText = textState;
    elements.headlightsText.className = 'status-indicator ' + (textState === 'Off' ? 'Off' : 'On');
}

function setLeftIndicator(state) {
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
    
    // TAMPILAN BARU: Memperbarui ikon dan blinking
    const [leftText, rightText] = elements.indicators.innerText.split(' / ');
    elements.indicatorsText.innerText = `${leftText} / ${rightText}`;
    elements.indicatorsText.classList.toggle('blinking', leftText === 'On' || rightText === 'On');
}

function setRightIndicator(state) {
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;

    // TAMPILAN BARU: Memperbarui ikon dan blinking
    const [leftText, rightText] = elements.indicators.innerText.split(' / ');
    elements.indicatorsText.innerText = `${leftText} / ${rightText}`;
    elements.indicatorsText.classList.toggle('blinking', leftText === 'On' || rightText === 'On');
}

function setSeatbelts(state) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #seatbelts
    elements.seatbelts.innerText = onOrOff(state);

    // TAMPILAN BARU: Memperbarui teks indikator
    elements.seatbeltsText.innerText = onOrOff(state);
    elements.seatbeltsText.className = 'status-indicator ' + onOrOff(state);
}

function setSpeedMode(mode) {
    // FUNGSI ASLI ANDA: Ini mengisi elemen tersembunyi #speed-mode
    speedMode = mode;
    let unit;
    switch(mode)
    {
        case 1: unit = 'MPH'; break;
        case 2: unit = 'Knots'; break;
        default: unit = 'KMH';
    }
    elements.speedMode.innerText = unit;

    // TAMPILAN BARU: Memperbarui unit kecepatan yang terlihat
    elements.speedUnit.innerText = unit;
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // MEMPERTUKARKAN ELEMEN ASLI DENGAN ELEMEN BARU UNTUK DISPLAY
    elements = {
        // ID ASLI (di-hack agar JS lama Anda tetap mengisi data)
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
        
        // ID BARU (untuk tampilan visual)
        speedValue: document.getElementById('speed-value'),
        speedUnit: document.getElementById('speed-unit'),
        gearValue: document.getElementById('gear-value'),
        rpmValue: document.getElementById('rpm-value'),
        fuelBarFill: document.getElementById('fuel-bar-fill'),
        healthBarFill: document.getElementById('health-bar-fill'),
        headlightsText: document.getElementById('headlights-text'),
        seatbeltsText: document.getElementById('seatbelts-text'),
        indicatorsText: document.getElementById('indicators-text'),
        speedoContainer: document.getElementById('speedometer-container'),
    };
    
    // Inisialisasi tampilan kecepatan (Wajib)
    setSpeedMode(speedMode); 
});

// Anda mungkin perlu menambahkan NUI message listener di sini
// jika file script.js awal Anda tidak memilikinya (meskipun biasanya ada)
/*
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'updateSpeedometer' && data.inVehicle) {
        // Panggil fungsi-fungsi setXXX(value) di sini berdasarkan data
    }
});
*/

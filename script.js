// VARIABEL ASLI ANDA
let elements = {};
let speedMode = 1; // Default MPH (dari kode asli Anda)
let indicators = 0;

const onOrOff = state => state ? 'On' : 'Off';

// === FUNGSI ASLI ANDA (Dimodifikasi untuk memperbarui tampilan baru) ===

function setEngine(state) {
    elements.engine.innerText = onOrOff(state);
}

function setSpeed(speed) {
    let calculatedSpeed;
    switch(speedMode)
    {
        case 1: calculatedSpeed = Math.round(speed * 2.236936); break; // MPH
        case 2: calculatedSpeed = Math.round(speed * 1.943844); break; // Knots
        default: calculatedSpeed = Math.round(speed * 3.6); // KMH
    }
    
    elements.speed.innerText = `${calculatedSpeed} ${elements.speedUnit.innerText}`;
    elements.speedValue.innerText = String(calculatedSpeed).padStart(3, '0');
}

function setRPM(rpm) {
    elements.rpm.innerText = `${rpm.toFixed(4)} RPM`;
    // Menampilkan nilai RPM yang lebih mudah dibaca (0-8000)
    elements.rpmValue.innerText = `${Math.round(rpm * 8000)}`; 
    
    // Opsional: Warna RPM
    const rpmValue = rpm * 8000;
    let color = '#FFF'; 
    if (rpmValue > 7000) {
        color = '#FF4136'; // Red
    } else if (rpmValue > 5000) {
        color = '#FFC107'; // Yellow
    }
    elements.rpmValue.style.color = color;
}

function setFuel(fuel) {
    const percentage = (fuel * 100).toFixed(0); 
    elements.fuel.innerText = `${percentage}%`;
    elements.fuelPercent.innerText = `${percentage}%`;

    let color = '#FFF'; 
    if (percentage < 20) {
        color = '#FF4136'; 
    }
    elements.fuelPercent.style.color = color;
}

function setHealth(health) {
    const percentage = (health * 100).toFixed(0); 
    elements.health.innerText = `${percentage}%`;
    elements.healthPercent.innerText = `${percentage}%`;
    
    let color = '#FFF'; 
    if (percentage < 20) {
        color = '#FF4136'; 
    } else if (percentage < 50) {
        color = '#FFC107'; 
    }
    elements.healthPercent.style.color = color;
}

function setGear(gear) {
    elements.gear.innerText = String(gear);
    elements.gearValue.innerText = gear === 0 ? 'N' : String(gear);
}

function setHeadlights(state) {
    let textState = 'Off';
    if (state === 1) textState = 'On';
    if (state === 2) textState = 'High Beam';
    elements.headlights.innerText = textState;

    const isOn = state > 0;
    elements.headlightsIcon.classList.toggle('icon-on', isOn);
    elements.headlightsIcon.classList.toggle('icon-off', !isOn);
}

function setLeftIndicator(state) {
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
    elements.leftIndicator.classList.toggle('arrow-on', state);
}

function setRightIndicator(state) {
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
    elements.rightIndicator.classList.toggle('arrow-on', state);
}

function setSeatbelts(state) {
    elements.seatbelts.innerText = onOrOff(state);
    elements.seatbeltIcon.classList.toggle('icon-on', state);
    elements.seatbeltIcon.classList.toggle('icon-off', !state);
}

function setSpeedMode(mode) {
    speedMode = mode;
    let unitText;
    switch(mode)
    {
        case 1: unitText = 'MPH'; break;
        case 2: unitText = 'Knots'; break;
        default: unitText = 'KMH';
    }
    elements.speedMode.innerText = unitText;
    elements.speedUnit.innerText = unitText;
}


// === NUI INTERFACE (Mengatasi Masalah Hilang 1 Detik) ===
window.addEventListener('message', (event) => {
    const data = event.data;
    
    // Cek apakah ada data yang masuk
    const dataReceived = data.speed !== undefined || data.inVehicle !== undefined;
    
    // Logika tampil/sembunyi berdasarkan field 'inVehicle' dari server/client.lua Anda
    const isInVehicle = data.inVehicle !== undefined ? data.inVehicle : (data.speed !== undefined); 

    if (isInVehicle) {
        elements.speedoContainer.style.display = 'flex'; // Tampilkan HUD

        if (data.engine !== undefined) setEngine(data.engine);
        if (data.speed !== undefined) setSpeed(data.speed); 
        if (data.rpm !== undefined) setRPM(data.rpm);
        if (data.fuel !== undefined) setFuel(data.fuel);
        if (data.health !== undefined) setHealth(data.health);
        if (data.gear !== undefined) setGear(data.gear);
        if (data.headlights !== undefined) setHeadlights(data.headlights);
        if (data.seatbelts !== undefined) setSeatbelts(data.seatbelts);
        
        // Asumsi data.indicators adalah bitmask (0, 1=Kiri, 2=Kanan, 3=Keduanya)
        if (data.indicators !== undefined) {
             setLeftIndicator(data.indicators & 0b01);
             setRightIndicator(data.indicators & 0b10);
        }

        if (data.speedMode !== undefined) setSpeedMode(data.speedMode);
    } else if (dataReceived) {
        // Jika data diterima tetapi inVehicle=false, sembunyikan.
        elements.speedoContainer.style.display = 'none'; 
    }
});


// === DOM LOADED (Inisialisasi) ===
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // --- ID Asli (yang harus diisi agar JS lama Anda tetap berfungsi) ---
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
        
        // --- ID Baru (untuk tampilan visual) ---
        speedoContainer: document.getElementById('speedometer-container'),
        speedValue: document.getElementById('speed-value'),
        speedUnit: document.getElementById('speed-unit'),
        rpmValue: document.getElementById('rpm-value'),
        fuelPercent: document.getElementById('fuel-percent'),
        healthPercent: document.getElementById('health-percent'),
        gearValue: document.getElementById('gear-value'),
        headlightsIcon: document.getElementById('headlights-icon'),
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        leftIndicator: document.getElementById('left-indicator'),
        rightIndicator: document.getElementById('right-indicator'),
    };
    
    // Inisialisasi unit kecepatan
    setSpeedMode(speedMode); 

    // Sembunyikan default
    elements.speedoContainer.style.display = 'none';
});

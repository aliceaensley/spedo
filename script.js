// Variabel elements tetap dibutuhkan untuk memetakan ID yang disembunyikan
let elements = {};
let speedMode = 1; // Default MPH

// =========================================================================
// !!! FUNGSI setXXX TIDAK ADA DI SINI !!!
// Kita asumsikan fungsi setSpeed(), setFuel(), dll., sudah didefinisikan 
// di tempat lain atau di file JS Anda yang asli (yang tidak Anda kirimkan). 
// Jika ini adalah satu-satunya script.js, Anda HARUS menempatkan fungsi setXXX di sini.
// =========================================================================

// --- FUNGSI MAPPING MINIMAL (PENTING UNTUK COMPATIBILITY) ---
// Kita harus mendefinisikan fungsi setXXX agar tidak error, meskipun kosong
// Jika skrip server Anda memanggil setSpeed(nilai), ia harus menemukannya.
function setSpeed(speed) { 
    // Jika Anda punya logika setSpeed yang rumit, masukkan di sini.
    // Untuk saat ini, kita hanya perbarui display baru:
    let calculatedSpeed;
    switch(speedMode)
    {
        case 1: calculatedSpeed = Math.round(speed * 2.236936); break; // MPH
        default: calculatedSpeed = Math.round(speed * 3.6); // KMH
    }
    if (elements.speedValue) elements.speedValue.innerText = String(calculatedSpeed).padStart(3, '0');
    if (elements.speed) elements.speed.innerText = `${calculatedSpeed}`; // Update hidden ID
}
function setRPM(rpm) {
    if (elements.rpmValue) elements.rpmValue.innerText = `${Math.round(rpm * 8000)}`;
}
function setFuel(fuel) {
    const percentage = (fuel * 100).toFixed(0); 
    if (elements.fuelPercent) elements.fuelPercent.innerText = `${percentage}%`;
}
function setHealth(health) {
    const percentage = (health * 100).toFixed(0); 
    if (elements.healthPercent) elements.healthPercent.innerText = `${percentage}%`;
}
function setGear(gear) {
    if (elements.gearValue) elements.gearValue.innerText = gear === 0 ? 'N' : String(gear);
}
function setHeadlights(state) {
    const isOn = state > 0;
    if (elements.headlightsIcon) elements.headlightsIcon.classList.toggle('icon-on', isOn);
}
function setSeatbelts(state) {
    if (elements.seatbeltIcon) elements.seatbeltIcon.classList.toggle('icon-on', state);
}
function setLeftIndicator(state) {
    if (elements.leftIndicator) elements.leftIndicator.classList.toggle('arrow-on', state);
}
function setRightIndicator(state) {
    if (elements.rightIndicator) elements.rightIndicator.classList.toggle('arrow-on', state);
}
function setEngine(state) { /* Do nothing */ }
function setSpeedMode(mode) { 
    speedMode = mode;
    let unitText = 'KMH';
    if (mode === 1) unitText = 'MPH'; else if (mode === 2) unitText = 'Knots';
    if (elements.speedUnit) elements.speedUnit.innerText = unitText;
}


// === NUI INTERFACE: FOKUS HANYA PADA TAMPIL/SEMBUNYI DAN DATA MENTAH ===
window.addEventListener('message', (event) => {
    const data = event.data;

    // TAMPILKAN jika ada field 'show: true' atau 'inVehicle: true'
    const shouldShow = data.show === true || data.inVehicle === true || (data.speed !== undefined && data.speed > 0); 
    
    // Logic: Jika server berhenti mengirim data, kita sembunyikan.
    if (shouldShow) {
        if (elements.speedoContainer) elements.speedoContainer.style.display = 'flex';
    } else {
        if (elements.speedoContainer) elements.speedoContainer.style.display = 'none';
    }
    
    // Panggil fungsi setXXX dengan data yang diterima
    if (data.speed !== undefined) setSpeed(data.speed); 
    if (data.rpm !== undefined) setRPM(data.rpm);
    if (data.fuel !== undefined) setFuel(data.fuel);
    if (data.health !== undefined) setHealth(data.health);
    if (data.gear !== undefined) setGear(data.gear);
    if (data.headlights !== undefined) setHeadlights(data.headlights);
    if (data.seatbelts !== undefined) setSeatbelts(data.seatbelts);
    
    // Indicators (berdasarkan data.indicators, data.leftIndicator, atau data.rightIndicator)
    if (data.indicators !== undefined) {
         setLeftIndicator(data.indicators & 0b01);
         setRightIndicator(data.indicators & 0b10);
    } else {
        // Jika ada field terpisah, gunakan field terpisah
        if (data.leftIndicator !== undefined) setLeftIndicator(data.leftIndicator);
        if (data.rightIndicator !== undefined) setRightIndicator(data.rightIndicator);
    }
});


// === DOM LOADED (Inisialisasi) ===
document.addEventListener('DOMContentLoaded', () => {
    // === MAPPING ELEMEN (Wajib) ===
    elements = {
        // --- ID Asli ---
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
        
        // --- ID Baru ---
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
    
    setSpeedMode(speedMode); 

    // Sembunyikan default
    if (elements.speedoContainer) elements.speedoContainer.style.display = 'none';
});

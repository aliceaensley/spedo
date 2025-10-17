// VARIABEL ASLI ANDA
let elements = {};
let speedMode = 1; // Default MPH (dari kode asli Anda)
let indicators = 0; // Menggunakan ini untuk melacak status indikator

// Fungsi pembantu untuk mengubah state boolean menjadi teks "On" atau "Off"
const onOrOff = state => state ? 'On' : 'Off';

// === FUNGSI ASLI ANDA (Dimodifikasi untuk memperbarui tampilan baru) ===

function setEngine(state) {
    // Memperbarui elemen #engine yang tersembunyi
    elements.engine.innerText = onOrOff(state);
    // Tidak ada tampilan visual Engine ON/OFF di desain gambar
}

function setSpeed(speed) {
    let calculatedSpeed;
    // Konversi kecepatan berdasarkan speedMode
    switch(speedMode)
    {
        case 1: calculatedSpeed = Math.round(speed * 2.236936); break; // MPH
        case 2: calculatedSpeed = Math.round(speed * 1.943844); break; // Knots
        default: calculatedSpeed = Math.round(speed * 3.6); // KMH
    }
    
    // Memperbarui elemen #speed yang tersembunyi
    elements.speed.innerText = `${calculatedSpeed} ${elements.speedUnit.innerText}`;

    // Memperbarui nilai speed yang terlihat (dengan padding nol)
    elements.speedValue.innerText = String(calculatedSpeed).padStart(3, '0');
}

function setRPM(rpm) {
    // Memperbarui elemen #rpm yang tersembunyi
    elements.rpm.innerText = `${rpm.toFixed(4)} RPM`;

    // Memperbarui nilai RPM yang terlihat
    elements.rpmValue.innerText = `${Math.round(rpm * 8000)}`; // Konversi ke nilai RPM sebenarnya
    
    // Opsional: Ubah warna RPM saat mendekati redline
    let rpmColor = elements.rpmValue.style.color;
    if (rpm * 8000 > 7000) {
        rpmColor = '#FF4136'; // Danger Red
    } else if (rpm * 8000 > 5000) {
        rpmColor = '#FFC107'; // Warning Yellow
    } else {
        rpmColor = elements.rpmValue.initialColor || elements.rpmValue.style.color; 
    }
    elements.rpmValue.style.color = rpmColor;
}

function setFuel(fuel) {
    // Memperbarui elemen #fuel yang tersembunyi
    const percentage = (fuel * 100).toFixed(0); 
    elements.fuel.innerText = `${percentage}%`;

    // Memperbarui teks persentase
    elements.fuelPercent.innerText = `${percentage}%`;

    // Atur warna teks (Tidak ada bar di gambar, hanya teks)
    let color = '#FFF'; // Default White
    if (percentage < 20) {
        color = '#FF4136'; // Red
    }
    elements.fuelPercent.style.color = color;
}

function setHealth(health) {
    // Memperbarui elemen #health yang tersembunyi
    const percentage = (health * 100).toFixed(0); 
    elements.health.innerText = `${percentage}%`;

    // Memperbarui teks persentase
    elements.healthPercent.innerText = `${percentage}%`;
    
    // Atur warna teks
    let color = '#FFF'; // Default White
    if (percentage < 20) {
        color = '#FF4136'; // Red
    } else if (percentage < 50) {
        color = '#FFC107'; // Yellow
    }
    elements.healthPercent.style.color = color;
}

function setGear(gear) {
    // Memperbarui elemen #gear yang tersembunyi
    elements.gear.innerText = String(gear);

    // Memperbarui nilai gear yang terlihat
    elements.gearValue.innerText = gear === 0 ? 'N' : String(gear);
}

function setHeadlights(state) {
    // Memperbarui elemen #headlights yang tersembunyi
    let textState = 'Off';
    if (state === 1) textState = 'On';
    if (state === 2) textState = 'High Beam';
    elements.headlights.innerText = textState;

    // Memperbarui ikon
    const isOn = state > 0;
    elements.headlightsIcon.classList.toggle('icon-on', isOn);
    elements.headlightsIcon.classList.toggle('icon-off', !isOn);
}

function setLeftIndicator(state) {
    // Logika asli Anda untuk indicators bitmask
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
    
    // Memperbarui ikon dan animasi blinking
    elements.leftIndicator.classList.toggle('arrow-on', state);
}

function setRightIndicator(state) {
    // Logika asli Anda untuk indicators bitmask
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;

    // Memperbarui ikon dan animasi blinking
    elements.rightIndicator.classList.toggle('arrow-on', state);
}

function setSeatbelts(state) {
    // Memperbarui elemen #seatbelts yang tersembunyi
    elements.seatbelts.innerText = onOrOff(state);

    // Memperbarui ikon
    elements.seatbeltIcon.classList.toggle('icon-on', state);
    elements.seatbeltIcon.classList.toggle('icon-off', !state);
}

function setSpeedMode(mode) {
    // Memperbarui variabel speedMode asli
    speedMode = mode;
    
    // Memperbarui elemen #speed-mode yang tersembunyi
    let unitText;
    switch(mode)
    {
        case 1: unitText = 'MPH'; break;
        case 2: unitText = 'Knots'; break;
        default: unitText = 'KMH';
    }
    elements.speedMode.innerText = unitText;

    // Memperbarui unit teks yang terlihat
    elements.speedUnit.innerText = unitText;
}


// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // === MAPPING ELEMEN DARI STRUKTUR HTML ASLI KE ELEMEN BARU ===

    elements = {
        // --- ID Asli (digunakan oleh fungsi setXXX() Anda) ---
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
        
        // --- ID Baru (untuk tampilan visual yang keren) ---
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
    
    // Inisialisasi awal unit kecepatan dan sembunyikan container
    setSpeedMode(speedMode); 
    elements.speedoContainer.style.display = 'none'; // Sembunyikan default
});


// FIVE-M NUI INTERFACE: Menerima data dari client.lua
window.addEventListener('message', (event) => {
    const data = event.data;
    
    // Asumsi resource Anda mengirimkan data.inVehicle atau sejenisnya
    const isInVehicle = data.inVehicle !== undefined ? data.inVehicle : (data.speed !== undefined); 

    if (isInVehicle) {
        elements.speedoContainer.style.display = 'flex'; // Tampilkan HUD
        
        // Panggil fungsi asli Anda dengan data dari resource game
        if (data.engine !== undefined) setEngine(data.engine);
        if (data.speed !== undefined) setSpeed(data.speed); 
        if (data.rpm !== undefined) setRPM(data.rpm);
        if (data.fuel !== undefined) setFuel(data.fuel);
        if (data.health !== undefined) setHealth(data.health);
        if (data.gear !== undefined) setGear(data.gear);
        if (data.headlights !== undefined) setHeadlights(data.headlights);
        if (data.seatbelts !== undefined) setSeatbelts(data.seatbelts);
        
        // Indicators (menggunakan logika bitwise jika data.indicators ada)
        if (data.indicators !== undefined) {
             setLeftIndicator(data.indicators & 0b01);
             setRightIndicator(data.indicators & 0b10);
        } else {
             // Jika tidak ada bitmask, asumsikan indikator mati
             setLeftIndicator(false);
             setRightIndicator(false);
        }

        if (data.speedMode !== undefined) setSpeedMode(data.speedMode);
    } else {
        elements.speedoContainer.style.display = 'none'; // Sembunyikan HUD
    }
});

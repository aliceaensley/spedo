// VARIABEL ASLI ANDA
let elements = {};
let speedMode = 0; // Mengubah default ke KMH karena lebih umum
let indicators = 0; // Menggunakan ini untuk melacak status indikator

// Fungsi pembantu untuk mengubah state boolean menjadi teks "On" atau "Off"
const onOrOff = state => state ? 'On' : 'Off';

// --- FUNGSI ASLI ANDA (Dimodifikasi untuk memperbarui tampilan baru) ---

function setEngine(state) {
    // Mempertahankan kompatibilitas dengan elemen #engine asli jika ada
    elements.engine.innerText = onOrOff(state);
    
    // Tampilan ENGINE ON/OFF tidak ada di gambar referensi, jadi kita tidak menampilkannya secara langsung
    // Jika Anda ingin menampilkannya, Anda bisa menambahkan elemen di HTML dan mengaktifkan ini:
    // console.log("Engine State:", onOrOff(state)); 
}

/**
 * Updates the speed display based on the current speed mode.
 * @param {number} speed - The speed value in meters per second (m/s).
 */
function setSpeed(speed) {
    let calculatedSpeed;
    
    // Konversi kecepatan berdasarkan speedMode
    switch(speedMode)
    {
        case 1: calculatedSpeed = Math.round(speed * 2.236936); break; // MPH
        case 2: calculatedSpeed = Math.round(speed * 1.943844); break; // Knots
        default: calculatedSpeed = Math.round(speed * 3.6); // KMH
    }
    
    // Memperbarui elemen #speed yang tersembunyi (untuk kompatibilitas JS asli)
    elements.speed.innerText = `${calculatedSpeed} ${elements.speedUnit.innerText}`;

    // Memperbarui nilai speed yang terlihat di desain baru
    elements.speedValue.innerText = String(calculatedSpeed).padStart(3, '0');
}

/**
 * Updates the RPM (Revolutions Per Minute) display.
 * @param {number} rpm - The RPM value to display. (0 to 1).
 */
function setRPM(rpm) {
    // Memperbarui elemen #rpm yang tersembunyi
    elements.rpm.innerText = `${rpm.toFixed(4)} RPM`;

    // Memperbarui nilai RPM yang terlihat di desain baru
    elements.rpmValue.innerText = `${Math.round(rpm * 8000)}`; // Konversi ke nilai RPM sebenarnya
}

/**
 * Updates the fuel level display as a percentage.
 * @param {number} fuel - The fuel level (0 to 1).
 */
function setFuel(fuel) {
    // Memperbarui elemen #fuel yang tersembunyi
    const percentage = (fuel * 100).toFixed(0); // Tampilkan tanpa desimal
    elements.fuel.innerText = `${percentage}%`;

    // Memperbarui bar fill dan teks persentase di desain baru
    elements.fuelBarFill.style.width = `${percentage}%`;
    elements.fuelPercent.innerText = `${percentage}%`;

    // Atur warna bar berdasarkan persentase
    let color = '#4CAF50'; // Default Green
    if (percentage < 20) {
        color = '#ff5252'; // Red
    } else if (percentage < 50) {
        color = '#FFC107'; // Yellow
    }
    elements.fuelBarFill.style.backgroundColor = color;
}

/**
 * Updates the vehicle health display as a percentage.
 * @param {number} health - The vehicle health level (0 to 1).
 */
function setHealth(health) {
    // Memperbarui elemen #health yang tersembunyi
    const percentage = (health * 100).toFixed(0); // Tampilkan tanpa desimal
    elements.health.innerText = `${percentage}%`;

    // Memperbarui bar fill dan teks persentase di desain baru
    elements.healthBarFill.style.width = `${percentage}%`;
    elements.healthPercent.innerText = `${percentage}%`;
    
    // Atur warna bar berdasarkan persentase (sesuai contoh gambar, bisa diubah)
    let color = '#00FFFF'; // Teal (default)
    if (percentage < 20) {
        color = '#ff5252'; // Red
    } else if (percentage < 50) {
        color = '#FFC107'; // Yellow
    }
    elements.healthBarFill.style.backgroundColor = color;
}

/**
 * Updates the current gear display.
 * @param {number} gear - The current gear to display. 0 represents neutral/reverse.
 */
function setGear(gear) {
    // Memperbarui elemen #gear yang tersembunyi
    elements.gear.innerText = String(gear);

    // Memperbarui nilai gear yang terlihat di desain baru
    elements.gearValue.innerText = gear === 0 ? 'N' : String(gear);
}

/**
 * Updates the headlights status display.
 * @param {number} state - The headlight state (0: Off, 1: On, 2: High Beam).
 */
function setHeadlights(state) {
    // Memperbarui elemen #headlights yang tersembunyi
    let textState = 'Off';
    if (state === 1) textState = 'On';
    if (state === 2) textState = 'High Beam';
    elements.headlights.innerText = textState;

    // Memperbarui ikon di desain baru
    if (state > 0) {
        elements.headlightsIcon.classList.remove('icon-off');
        elements.headlightsIcon.classList.add('icon-on');
    } else {
        elements.headlightsIcon.classList.remove('icon-on');
        elements.headlightsIcon.classList.add('icon-off');
    }
}

/**
 * Sets the state of the left turn indicator and updates the display.
 * @param {boolean} state - If true, turns the left indicator on; otherwise, turns it off.
 */
function setLeftIndicator(state) {
    // Memperbarui variabel indicators asli
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
    
    // Memperbarui ikon di desain baru (mengaktifkan/menonaktifkan kelas blinking)
    elements.leftIndicator.classList.toggle('arrow-on', state);
}

/**
 * Sets the state of the right turn indicator and updates the display.
 * @param {boolean} state - If true, turns the right indicator on; otherwise, turns it off.
 */
function setRightIndicator(state) {
    // Memperbarui variabel indicators asli
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;

    // Memperbarui ikon di desain baru
    elements.rightIndicator.classList.toggle('arrow-on', state);
}

/**
 * Updates the seatbelt status display.
 * @param {boolean} state - If true, indicates seatbelts are fastened; otherwise, indicates they are not.
 */
function setSeatbelts(state) {
    // Memperbarui elemen #seatbelts yang tersembunyi
    elements.seatbelts.innerText = onOrOff(state);

    // Memperbarui ikon di desain baru
    if (state) {
        elements.seatbeltIcon.classList.remove('icon-off');
        elements.seatbeltIcon.classList.add('icon-on');
    } else {
        elements.seatbeltIcon.classList.remove('icon-on');
        elements.seatbeltIcon.classList.add('icon-off');
    }
}

/**
 * Sets the speed display mode and updates the speed unit display.
 * @param {number} mode - The speed mode to set (0: KMH, 1: MPH, 2: Knots).
 */
function setSpeedMode(mode) {
    // Memperbarui variabel speedMode asli
    speedMode = mode;
    
    // Memperbarui elemen #speed-mode yang tersembunyi
    let unitText;
    switch(mode)
    {
        case 1: unitText = 'MPH'; break;
        case 2: unitText = 'KNOTS'; break;
        default: unitText = 'KMH';
    }
    elements.speedMode.innerText = unitText;

    // Memperbarui unit teks di tampilan baru
    elements.speedUnit.innerText = unitText;
}

// =========================================================================
// FIVE-M NUI INTERFACE: Menerima data dari client.lua
// =========================================================================
window.addEventListener('message', (event) => {
    const data = event.data;
    
    // Mengasumsikan ada event 'update' dari client.lua
    // Client.lua yang terhubung ke JS asli Anda mungkin mengirimkan data langsung
    // atau memiliki field 'type'. Kita buat fleksibel.
    if (data.type === 'update' || data.engine !== undefined || data.speed !== undefined) {
        
        // Asumsi data.engine status (boolean) akan dikirim
        // TAPI karena di gambar tidak ada status Engine ON/OFF, kita tidak menampilkan secara visual
        // if (data.engine !== undefined) setEngine(data.engine); 
        
        if (data.speed !== undefined) setSpeed(data.speed); 
        if (data.rpm !== undefined) setRPM(data.rpm);
        if (data.fuel !== undefined) setFuel(data.fuel);
        if (data.health !== undefined) setHealth(data.health);
        if (data.gear !== undefined) setGear(data.gear);
        if (data.headlights !== undefined) setHeadlights(data.headlights);
        if (data.seatbelts !== undefined) setSeatbelts(data.seatbelts);
        
        // Indicators membutuhkan data terpisah untuk kiri/kanan.
        // Asumsi resource Anda mengirimkan data.leftIndicator dan data.rightIndicator.
        // Jika tidak, kita bisa menggunakan logika bitwise dari data.indicators jika dikirim
        if (data.leftIndicator !== undefined) setLeftIndicator(data.leftIndicator);
        if (data.rightIndicator !== undefined) setRightIndicator(data.rightIndicator);
        // Jika data.indicators adalah bitmask (0,1,2,3), bisa diubah:
        // if (data.indicators !== undefined) {
        //     setLeftIndicator(data.indicators & 0b01);
        //     setRightIndicator(data.indicators & 0b10);
        // }

        if (data.speedMode !== undefined) setSpeedMode(data.speedMode);

        // Tampilkan/sembunyikan container
        if (data.inVehicle !== undefined) {
            elements.speedoContainer.style.display = data.inVehicle ? 'flex' : 'none';
        } else {
            // Default jika tidak ada inVehicle field, asumsikan selalu terlihat
            elements.speedoContainer.style.display = 'flex';
        }
    }
});


// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // === MAPPING ELEMEN DARI STRUKTUR HTML ASLI KE ELEMEN BARU ===
    // Ini memastikan fungsi setXXX asli Anda tetap memanipulasi DOM,
    // meskipun elemen tersebut tersembunyi atau hanya sebagai placeholder.

    elements = {
        // --- ID Asli (digunakan oleh fungsi setXXX() Anda) ---
        // Kita tetap mendapatkan referensi ke ini, meskipun beberapa disembunyikan
        engine: document.getElementById('engine'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        speedMode: document.getElementById('speed-mode'), // Ini juga diubah untuk tampilan baru
        
        // --- ID Baru (untuk tampilan visual yang keren) ---
        speedoContainer: document.getElementById('speedometer-container'),
        speedValue: document.getElementById('speed-value'),
        speedUnit: document.getElementById('speed-unit'),
        rpmValue: document.getElementById('rpm-value'),
        fuelBarFill: document.getElementById('fuel-bar-fill'),
        fuelPercent: document.getElementById('fuel-percent'),
        healthBarFill: document.getElementById('health-bar-fill'),
        healthPercent: document.getElementById('health-percent'),
        gearValue: document.getElementById('gear-value'),
        headlightsIcon: document.getElementById('headlights-icon'),
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        leftIndicator: document.getElementById('left-indicator'),
        rightIndicator: document.getElementById('right-indicator'),
    };
    
    // Inisialisasi awal unit kecepatan agar sesuai dengan speedMode default Anda
    setSpeedMode(speedMode); 

    // Sembunyikan secara default saat DOM loaded (akan ditampilkan oleh NUI message)
    elements.speedoContainer.style.display = 'none';
});

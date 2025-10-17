let elements = {};
let speedMode = 1; 
let indicators = 0; 
let isHeadUnitOpen = false; // Status Head Unit/Tablet

const onOrOff = state => state ? 'On' : 'Off';

// Helper function for toggling active state
const toggleActive = (element, state) => {
// ... (Fungsi tetap sama) ...
};

// ... (Semua fungsi set tetap sama: setEngine, setSpeed, setRPM, setFuel, setHealth, setGear, setHeadlights, setSeatbelts, setSpeedMode) ...

/**
 * Updates the time display to current WIB.
 */
function updateTimeWIB() {
// ... (Fungsi tetap sama) ...
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

// FUNGSI BARU: Simulasi Interaksi Head Unit
function toggleHeadUnit(key) {
    if (!key || key === 'F2') { // Anggap F2 adalah tombol pemicu
        isHeadUnitOpen = !isHeadUnitOpen;
        console.log(`[HEAD UNIT] Status: ${isHeadUnitOpen ? 'OPENED' : 'CLOSED'}`);
        
        // DI SINI ADALAH TEMPAT UNTUK MENGIRIM PERINTAH KE CLIENT/LUA
        // Contoh: Kirim data ke game bahwa tablet harus ditampilkan
        // if (typeof mp !== 'undefined' && mp.trigger) { mp.trigger('toggleTabletUI', isHeadUnitOpen); }
        
        // Di lingkungan browser, Anda bisa membuat elemen tablet muncul/hilang
        // const tablet = document.getElementById('tablet-ui');
        // if (tablet) { tablet.style.display = isHeadUnitOpen ? 'block' : 'none'; }
    }
}

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // ... (Elemen lama dan baru tetap sama) ...
        // Visible Elements
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        timeWIB: document.getElementById('time-wib'), 
        gear: document.getElementById('gear'),
        speedMode: document.getElementById('speed-mode'),

        // Icons for bottom panel
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'),
        seatbeltIcon: document.getElementById('seatbelt-icon'),
    };
    
    // Setup Waktu WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // Setup SIMULASI Tombol F2 (Hanya akan berfungsi di lingkungan game yang mendukungnya)
    // Untuk testing di browser, Anda bisa memanggil toggleHeadUnit() secara manual.
    // document.addEventListener('keydown', (e) => {
    //     if (e.key === 'F2') {
    //         e.preventDefault(); // Mencegah browser membuka Developer Tools atau fungsi F2 lainnya
    //         toggleHeadUnit('F2');
    //     }
    // });

    // Initial setup and example values 
    setSpeedMode(1); 
    setEngine(true);
    setSpeed(22.35); 
    setRPM(0.5821);
    setFuel(0.49);
    setHealth(1.0); 
    setGear(2);
    setHeadlights(1);
    setSeatbelts(true);
});

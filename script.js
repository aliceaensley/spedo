let elements = {};
let speedMode = 1; 
let engineState = false; 
let simulationInterval = null; 

// ... (Semua fungsi toggleActive, setSpeedMode, setSpeed, setRPM, setFuel, setHealth, setGear, setHeadlights, setEngine, setSeatbelts, stopSimulation, startSimulation, dan toggleHeadUnit tetap sama) ...

// --- PERBAIKAN PENTING: FUNGSI PEMBARUAN WAKTU WIB ---
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
    
    // Perbarui Jam di Speedometer
    if (elements.timeWIB) {
        elements.timeWIB.innerText = timeString;
    }
    
    // Perbarui Jam di Head Unit
    if (elements.headunitTimeWIB) {
        elements.headunitTimeWIB.innerText = timeString;
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'), 
        headunitFooter: document.getElementById('headunit-footer'), 
        tabletUI: document.getElementById('tablet-ui'),
        
        // Visible Elements (Speedometer)
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
        
        // Elemen Head Unit Baru
        headunitTimeWIB: document.getElementById('headunit-time-wib'), // <-- ID BARU
        closeTablet: document.getElementById('close-tablet'),
    };
    
    // 1. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); // Perbarui setiap menit
    
    // ... (Semua setup interaksi click dan inisiasi data lainnya tetap sama) ...

    // Matikan Mesin (status awal)
    setEngine(false); 

    // Simulasikan tombol Engine On/Off
    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState);
        });
    }

    // Coba nyalakan mesin secara otomatis setelah 2 detik 
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

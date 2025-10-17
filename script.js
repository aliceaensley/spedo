let elements = {};
let speedMode = 1; 
let engineState = false; 
// Tambahkan state untuk indikator lain
let headlightsState = 1; // 0=Off, 1=Low, 2=High
let seatbeltState = true; 
let simulationInterval = null; 

// --- FUNGSI PEMBARUAN DATA SPEEDOMETER ---
// ... (setSpeedMode, setSpeed, setRPM, setFuel, setHealth, setGear, setSeatbelts tetap sama) ...
// HANYA FUNGSI UTAMA YANG DIUBAH/DITAMBAHKAN
function setHeadlights(state) {
    headlightsState = state;
    // Indikator dianggap aktif jika state > 0 (Low atau High)
    toggleActive(elements.headlightsIcon, state > 0);
}

function setEngine(state) {
    if (engineState !== state) {
        engineState = state;
        // Indikator Engine aktif jika engineState TRUE
        toggleActive(elements.engineIcon, state);
        if (state) {
            startSimulation();
        } else {
            stopSimulation();
        }
    }
}

function setSeatbelts(state) {
    seatbeltState = state;
    // Indikator Seatbelt aktif/menyala jika state FALSE (artinya belum dipakai)
    // Jika Anda ingin ikon muncul saat dipakai, ubah kondisi di bawah
    toggleActive(elements.seatbeltIcon, state); 
}

// ... (semua fungsi lain tetap sama hingga DOMContentLoaded) ...

// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen (TETAP SAMA)
    // ...
    elements = {
        // ... (semua pemetaan) ...
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'), 
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        // ...
    };
    
    // ... (Bagian 2 & 3: Clock dan Head Unit Clicks tetap sama) ...
    
    // ... (Bagian 4: Logic Klik Browser & YouTube tetap sama) ...

    // 5. INISIASI DATA DAN MESIN
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); 
    
    // Inisiasi awal state
    setEngine(false); 
    setHeadlights(1); // Default menyala
    setSeatbelts(true); // Default terpasang

    // 6. LOGIC BARU: INTERAKSI KLIK INDIKATOR

    // Logika Klik: MESIN (⚙️)
    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState); // Membalikkan status Mesin
        });
    }
    
    // Logika Klik: LAMPU (💡)
    if (elements.headlightsIcon) {
        elements.headlightsIcon.addEventListener('click', () => {
            // Logika sederhana: 1 -> 0 (On -> Off)
            // Bisa diperluas: 1 -> 2 -> 0 (Low -> High -> Off)
            const newState = (headlightsState === 1) ? 0 : 1; 
            setHeadlights(newState);
        });
    }

    // Logika Klik: SEATBELT (💺)
    if (elements.seatbeltIcon) {
        elements.seatbeltIcon.addEventListener('click', () => {
            setSeatbelts(!seatbeltState); // Membalikkan status Seatbelt
        });
    }


    // Mulai simulasi Mesin ON secara otomatis setelah 2 detik (TETAP SAMA)
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

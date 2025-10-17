let elements = {};
let speedMode = 1; 
let engineState = false; 
let simulationInterval = null; 

// ... (Semua fungsi toggleActive, setSpeed, setRPM, setEngine, toggleHeadUnit, dll. tetap sama) ...

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
        
        // Elemen Head Unit
        headunitTimeWIB: document.getElementById('headunit-time-wib'), 
        closeTablet: document.getElementById('close-tablet'),
        
        // ID BARU: Ikon Browser
        browserApp: document.getElementById('browser-app')
    };
    
    // 1. SETUP CLOCK WIB
    // ... (Setup WIB tetap sama) ...
    
    // 2. SETUP INTERAKSI CLICK HEAD UNIT
    if (elements.headunitFooter) {
        elements.headunitFooter.addEventListener('click', () => {
            toggleHeadUnit(true); 
        });
    }
    
    if (elements.closeTablet) {
        elements.closeTablet.addEventListener('click', () => {
            toggleHeadUnit(false); 
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.tabletUI && !elements.tabletUI.classList.contains('hidden')) {
            toggleHeadUnit(false);
        }
    });

    // --- LOGIC BARU: BROWSER APP (membuka https://nekopoi.care/) ---
    if (elements.browserApp) {
        elements.browserApp.addEventListener('click', () => {
            // Menggunakan window.open untuk membuka link di tab/jendela baru
            window.open('https://nekopoi.care/', '_blank'); 
            // Opsional: Tutup Head Unit setelah aplikasi dibuka
            toggleHeadUnit(false); 
        });
    }

    // 3. INISIASI DATA DAN MESIN
    // ... (Inisiasi data, engine control, dan simulasi tetap sama) ...
    
    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState);
        });
    }

    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

// ... (Fungsi-fungsi setSpeed, setRPM, updateTimeWIB, startSimulation, stopSimulation, dll. harus disertakan di atas bagian DOMContentLoaded) ...

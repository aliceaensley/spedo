let elements = {};
let speedMode = 1; 
let engineState = false; 
let simulationInterval = null; 

// ... (Semua fungsi toggleActive, setSpeed, setRPM, setEngine, updateTimeWIB, startSimulation, stopSimulation, dan toggleHeadUnit tetap sama) ...

// --- FUNGSI HEAD UNIT (LOGIC INTERAKSI) ---

function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footerTrigger = elements.headunitFooter;
    
    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        tablet.classList.remove('hidden');
        footerTrigger.style.display = 'none'; 

        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
    } else {
        tablet.classList.remove('active'); 
        
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            footerTrigger.style.display = 'block'; 
        }, transitionDuration); 
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // ... (Pemetaan elemen tetap sama) ...
        speedometerUI: document.getElementById('speedometer-ui'), 
        headunitFooter: document.getElementById('headunit-footer'), 
        tabletUI: document.getElementById('tablet-ui'),
        
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
        
        headunitTimeWIB: document.getElementById('headunit-time-wib'), 
        closeTablet: document.getElementById('close-tablet'),
        
        browserApp: document.getElementById('browser-app')
    };
    
    // 1. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 2. SETUP INTERAKSI CLICK (Head Unit & Close)
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

    // --- LOGIC: BROWSER APP (DIHAPUS toggleHeadUnit(false)) ---
    if (elements.browserApp) {
        elements.browserApp.addEventListener('click', () => {
            // Membuka link di tab baru
            window.open('https://nekopoi.care/', '_blank'); 
            
            // JANGAN menutup head unit secara langsung, biarkan user yang menutup.
            // Jika Anda ingin menutup headunit, gunakan penundaan yang lama,
            // contoh: setTimeout(() => toggleHeadUnit(false), 2000);
            
            // Saat ini, kita biarkan menu tetap terbuka agar klik tidak terinterupsi.
        });
    }

    // 4. INISIASI DATA DAN MESIN
    // ... (Inisiasi data dan engine control tetap sama) ...
    
    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState);
        });
    }

    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

// ... (Pastikan semua fungsi di atas, termasuk setSpeed, setRPM, updateTimeWIB, startSimulation, stopSimulation, dll., disertakan dalam file script.js Anda) ...

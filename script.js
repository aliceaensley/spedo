let elements = {};
let speedMode = 1; 
let indicators = 0; 

// ... (Semua fungsi toggleActive, setEngine, setSpeed, setRPM, setFuel, setHealth, setGear, setHeadlights, setSeatbelts, setSpeedMode tetap sama) ...

/**
 * Toggles the visibility of the Head Unit/Tablet UI and hides the main UI.
 */
function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const speedometer = elements.speedometerUI; 
    const mediaButton = elements.mediaButton;
    
    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        // OPEN Tablet
        tablet.classList.remove('hidden');
        speedometer.classList.add('hidden'); // Sembunyikan speedometer
        mediaButton.classList.add('hidden'); // Sembunyikan tombol media saat tablet terbuka
        console.log(`[HEAD UNIT] Status: OPENED (Main UI Hidden)`);
    } else {
        // CLOSE Tablet
        tablet.classList.add('hidden');
        speedometer.classList.remove('hidden'); // Tampilkan speedometer
        mediaButton.classList.remove('hidden'); // Tampilkan tombol media
        console.log(`[HEAD UNIT] Status: CLOSED (Main UI Visible)`);
    }
}

// ... (Fungsi updateTimeWIB tetap sama) ...

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'),
        mediaButton: document.getElementById('media-button'), // Tombol Baru
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
        
        // Tablet Close Element
        closeTablet: document.getElementById('close-tablet'),
    };
    
    // --- SETUP WIB ---
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // --- SETUP INTERAKSI CLICK ---
    // 1. Pemicu Buka: Klik pada tombol media
    elements.mediaButton.addEventListener('click', () => {
        toggleHeadUnit(true); // Buka tablet
    });
    
    // 2. Penutup: Klik tombol [ X ] di tablet
    elements.closeTablet.addEventListener('click', () => {
        toggleHeadUnit(false); // Tutup tablet
    });
    
    // 3. Penutup: Tombol ESCAPE
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Hanya tutup jika tablet sedang terbuka
            if (!elements.tabletUI.classList.contains('hidden')) {
                toggleHeadUnit(false);
            }
        }
    });

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

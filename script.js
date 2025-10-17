let elements = {};
let speedMode = 1; 
let indicators = 0; 

// ... (Semua fungsi toggleActive, setEngine, setSpeed, setRPM, setFuel, setHealth, setGear, setHeadlights, setSeatbelts, setSpeedMode tetap sama) ...

// ... (Fungsi updateTimeWIB tetap sama) ...

/**
 * Toggles the visibility of the Head Unit/Tablet UI.
 * @param {boolean} state - If true, opens the tablet; if false, closes it.
 */
function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footer = elements.headunitFooter;
    
    if (state === undefined) {
        // Toggle state if no state is explicitly passed
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        tablet.classList.remove('hidden');
        // DI SINI: Kirim perintah ke game untuk mengaktifkan kursor (jika di FiveM/GTARP)
        console.log(`[HEAD UNIT] Status: OPENED`);
    } else {
        tablet.classList.add('hidden');
        // DI SINI: Kirim perintah ke game untuk menyembunyikan kursor
        console.log(`[HEAD UNIT] Status: CLOSED`);
    }
}

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // ... (Elemen lama dan baru speedometer tetap sama) ...
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
        
        // Elemen BARU untuk interaksi
        headunitFooter: document.getElementById('headunit-footer'),
        tabletUI: document.getElementById('tablet-ui'),
        closeTablet: document.getElementById('close-tablet'),
    };
    
    // --- SETUP WIB ---
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // --- SETUP INTERAKSI CLICK ---
    // 1. Pemicu: Klik pada footer bar
    if (elements.headunitFooter) {
        elements.headunitFooter.addEventListener('click', () => {
            toggleHeadUnit(true); // Buka tablet
        });
    }
    
    // 2. Penutup: Klik tombol [ X ] di tablet
    if (elements.closeTablet) {
        elements.closeTablet.addEventListener('click', () => {
            toggleHeadUnit(false); // Tutup tablet
        });
    }
    
    // 3. Penutup: Tombol ESCAPE
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Hanya tutup jika tablet sedang terbuka
            if (!elements.tabletUI.classList.contains('hidden')) {
                toggleHeadUnit(false);
            }
        }
    });

    // ... (Initial setup dan example values tetap sama) ...
});

let elements = {};
let speedMode = 1; 
let indicators = 0; 

const onOrOff = state => state ? 'On' : 'Off';

// Helper function for toggling active state
const toggleActive = (element, state) => {
    if (state) {
        element.classList.add('active');
    } else {
        element.classList.remove('active');
    }
};

/**
 * Toggles the visibility of the Head Unit/Tablet UI.
 */
function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const mediaButton = elements.mediaButton;
    
    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        // OPEN Tablet
        tablet.classList.remove('hidden');
        mediaButton.classList.add('hidden'); // Sembunyikan tombol media agar tidak double-click
        // HILANGKAN PENYEMBUNYIAN SPEEDOMETER DARI SINI
        console.log(`[HEAD UNIT] Status: OPENED (Speedometer Tetap Aktif)`);
    } else {
        // CLOSE Tablet
        tablet.classList.add('hidden');
        mediaButton.classList.remove('hidden'); // Tampilkan tombol media
        console.log(`[HEAD UNIT] Status: CLOSED`);
    }
}

// ... (Semua fungsi set dan updateTimeWIB tetap sama) ...

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'),
        mediaButton: document.getElementById('media-button'),
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
            if (!elements.tabletUI.classList.contains('hidden')) {
                toggleHeadUnit(false);
            }
        }
    });

    // Initial setup and example values 
    // ... (Initial setup tetap sama) ...
});

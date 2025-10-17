let elements = {};
let speedMode = 1; 
let indicators = 0; 

const onOrOff = state => state ? 'On' : 'Off';

// Helper function for toggling active state
const toggleActive = (element, state) => {
    // Fungsi ini sekarang juga menerima array elemen
    if (Array.isArray(element)) {
        element.forEach(el => toggleActive(el, state));
        return;
    }
    
    if (state) {
        element.classList.add('active');
    } else {
        element.classList.remove('active');
    }
};

/**
 * Toggles the visibility of the Head Unit/Tablet UI.
 * Speedometer TIDAK akan disembunyikan.
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
        mediaButton.classList.add('hidden'); // Sembunyikan tombol media saat tablet terbuka
        console.log(`[HEAD UNIT] Status: OPENED (Speedometer Tetap Aktif)`);
    } else {
        // CLOSE Tablet
        tablet.classList.add('hidden');
        mediaButton.classList.remove('hidden'); // Tampilkan tombol media
        console.log(`[HEAD UNIT] Status: CLOSED`);
    }
}

// ... (Semua fungsi set tetap sama, hanya memengaruhi elemen speedometer utama) ...

/**
 * Updates the time display to current WIB.
 */
function updateTimeWIB() {
    const now = new Date();
    const options = {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' 
    };
    
    let timeString;
    try {
        timeString = now.toLocaleTimeString('en-US', options);
    } catch (e) {
        timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    elements.timeWIB.innerText = timeString;
}

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
    elements.mediaButton.addEventListener('click', () => {
        toggleHeadUnit(true); // Buka tablet
    });
    
    elements.closeTablet.addEventListener('click', () => {
        toggleHeadUnit(false); // Tutup tablet
    });
    
    // Tombol ESCAPE untuk menutup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.tabletUI.classList.contains('hidden')) {
            toggleHeadUnit(false);
        }
    });

    // Initial setup and example values 
    // Untuk memastikan speedometer terlihat dan berfungsi saat pertama kali dimuat
    // setSpeedMode, setEngine, setSpeed, dll. harus dipanggil di sini.
});

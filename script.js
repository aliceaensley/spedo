let elements = {};
let speedMode = 1; 

// ... (Semua fungsi set dan toggleActive tetap sama) ...

/**
 * Toggles the visibility and "expand up" animation of the Head Unit/Tablet UI.
 * SPEEDOMETER TIDAK disembunyikan.
 */
function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footerTrigger = elements.headunitFooter;
    
    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        // OPEN Tablet: Hilangkan hidden, lalu tambahkan active untuk memicu animasi
        tablet.classList.remove('hidden');
        footerTrigger.style.display = 'none'; // Sembunyikan trigger

        // Timeout 10ms untuk memicu transisi setelah elemen dirender
        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
        console.log(`[HEAD UNIT] Status: OPENED (Speedometer terlihat)`);
    } else {
        // CLOSE Tablet: Hilangkan active untuk memicu animasi kembali (turun & mengecil)
        tablet.classList.remove('active'); 
        
        // Sembunyikan sepenuhnya setelah animasi selesai (0.5s)
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            footerTrigger.style.display = 'block'; // Tampilkan trigger footer lagi
        }, transitionDuration); 
        
        console.log(`[HEAD UNIT] Status: CLOSED`);
    }
}

// ... (Semua fungsi set dan updateTimeWIB tetap sama) ...

// Wait for the DOM to be fully loaded and map elements
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // UI Containers
        speedometerUI: document.getElementById('speedometer-ui'), // SPEEDOMETER UTAMA
        headunitFooter: document.getElementById('headunit-footer'), // TRIGGER TENGAH
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
    
    // ... (Setup WIB dan Initial setup) ...
    
    // --- SETUP INTERAKSI CLICK ---
    elements.headunitFooter.addEventListener('click', () => {
        toggleHeadUnit(true); 
    });
    
    elements.closeTablet.addEventListener('click', () => {
        toggleHeadUnit(false); 
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.tabletUI.classList.contains('hidden')) {
            toggleHeadUnit(false);
        }
    });

    // Initial setup and example values 
    // Untuk memastikan speedometer terlihat dan berfungsi saat pertama kali dimuat
    // setSpeedMode, setEngine, setSpeed, dll. harus dipanggil di sini.
});

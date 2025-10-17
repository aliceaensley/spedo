let elements = {};
let speedMode = 1; 

// ... (Semua fungsi set tetap sama) ...

/**
 * Toggles the visibility and "expand up" animation of the Head Unit/Tablet UI.
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

        // Timeout 10ms untuk memastikan browser merender elemen sebelum menerapkan transisi
        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
        console.log(`[HEAD UNIT] Status: OPENED (Menu mengembang ke atas)`);
    } else {
        // CLOSE Tablet: Hilangkan active untuk memicu animasi kembali (turun & mengecil)
        tablet.classList.remove('active'); 
        
        // Sembunyikan sepenuhnya (tambahkan class hidden) setelah animasi selesai (0.5s)
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            footerTrigger.style.display = 'block'; // Tampilkan trigger footer lagi
        }, transitionDuration); 
        
        console.log(`[HEAD UNIT] Status: CLOSED (Menu mengecil)`);
    }
}

// ... (Semua fungsi updateTimeWIB dan event listener di DOMContentLoaded) ...

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
    // ... (Initial setup tetap sama) ...
});

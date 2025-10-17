let elements = {};
let speedMode = 1; 

const toggleActive = (element, state) => {
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
 * Toggles the visibility and "expand up" animation of the Head Unit/Tablet UI.
 * Speedometer TIDAK disembunyikan.
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

// ... (Semua fungsi setSpeed, setRPM, setFuel, dll. DITAHAN) ...

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
    
    // --- SETUP WIB ---
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
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

    // Initial setup (Contoh nilai untuk mengisi speedometer agar tidak kosong)
    // Asumsikan fungsi set sudah didefinisikan (walaupun tidak ditampilkan di sini)
    // setSpeedMode(1); setSpeed(22.35); setRPM(0.5821); setFuel(0.49); setHealth(1.0); setGear(2); 
});

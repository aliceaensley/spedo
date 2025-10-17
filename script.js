let elements = {};
let speedMode = 1; 
let engineState = false; 
let simulationInterval = null; 

// --- FUNGSI UTILITY & TOGGLE ---
const toggleActive = (element, state) => {
    if (Array.isArray(element)) {
        element.forEach(el => toggleActive(el, state));
        return;
    }
    
    // Perkuat: Pastikan elemen ada sebelum diakses
    if (element) {
        if (state) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }
};

// --- FUNGSI PEMBARUAN DATA SPEEDOMETER ---

function setSpeedMode(mode) {
    speedMode = mode;
    let unit = 'KMH';
    switch(mode)
    {
        case 1: unit = 'MPH'; break;
        case 2: unit = 'Knots'; break;
        default: unit = 'KMH';
    }
    if (elements.speedMode) elements.speedMode.innerText = unit;
}

function setSpeed(speed) {
    let speedValue;
    switch(speedMode)
    {
        case 1: speedValue = Math.round(speed * 2.236936); break; 
        case 2: speedValue = Math.round(speed * 1.943844); break; 
        default: speedValue = Math.round(speed * 3.6); 
    }
    const displayValue = String(speedValue).padStart(3, '0');
    if (elements.speed) elements.speed.innerText = displayValue;
}

function setRPM(rpm) {
    const displayValue = `${Math.round(rpm * 10000)}`;
    if (elements.rpm) elements.rpm.innerText = displayValue;
}

function setFuel(fuel) {
    const displayValue = `${Math.round(fuel * 100)}%`;
    if (elements.fuel) elements.fuel.innerText = displayValue;
}

function setHealth(health) {
    const displayValue = `${Math.round(health * 100)}%`;
    if (elements.health) elements.health.innerText = displayValue;
}

function setGear(gear) {
    let gearText = 'N';
    if (gear > 0) {
        gearText = String(gear);
    } else if (gear < 0) {
        gearText = 'R';
    }
    if (elements.gear) elements.gear.innerText = gearText;
}

function setHeadlights(state) {
    toggleActive(elements.headlightsIcon, state > 0);
}

function setEngine(state) {
    if (engineState !== state) {
        engineState = state;
        toggleActive(elements.engineIcon, state);
        if (state) {
            startSimulation();
        } else {
            stopSimulation();
        }
    }
}

function setSeatbelts(state) {
    toggleActive(elements.seatbeltIcon, state);
}

function updateTimeWIB() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };
    
    let timeString;
    try {
        timeString = now.toLocaleTimeString('en-US', options);
    } catch (e) {
        timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    if (elements.timeWIB) {
        elements.timeWIB.innerText = timeString;
    }
    
    if (elements.headunitTimeWIB) {
        elements.headunitTimeWIB.innerText = timeString;
    }
}


// --- FUNGSI KONTROL SIMULASI ---

function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    
    setSpeed(0);
    setRPM(0);
    setGear(0); 
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    setRPM(0.1); 
    setGear(0); 

    simulationInterval = setInterval(() => {
        currentSpeed = Math.min(25, currentSpeed + (Math.random() - 0.5) * 0.5); 
        currentSpeed = Math.max(0, currentSpeed); 
        setSpeed(currentSpeed);
        
        let baseRPM = currentSpeed > 5 ? 0.3 : 0.1;
        const currentRPM = Math.max(0.1, Math.min(0.9, baseRPM + (Math.random() - 0.5) * 0.05));
        setRPM(currentRPM);
        
        if (currentSpeed > 20) {
            setGear(3);
        } else if (currentSpeed > 10) {
            setGear(2);
        } else if (currentSpeed > 0) {
            setGear(1);
        } else {
            setGear(0); 
        }
        
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        setFuel(Math.max(0.1, currentFuelText / 100 - 0.005));

    }, 3000); 
}


// --- FUNGSI HEAD UNIT (Perkuat: Pastikan elemen ada) ---

function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footerTrigger = elements.headunitFooter;
    
    if (!tablet) return; // Keluar jika tablet tidak ada

    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        tablet.classList.remove('hidden');
        if (footerTrigger) footerTrigger.style.display = 'none'; 

        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
    } else {
        tablet.classList.remove('active'); 
        
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            if (footerTrigger) footerTrigger.style.display = 'block'; 
        }, transitionDuration); 
    }
}


// --- INISIALISASI DAN EVENT LISTENERS (DIPERKUAT) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
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
        
        browserApp: document.getElementById('browser-app') // ID Aplikasi Browser
    };
    
    // 2. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 3. SETUP INTERAKSI CLICK (Head Unit & Close)
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

    // 4. LOGIC PERBAIKAN FINAL: BROWSER APP (membuka link dan menutup Head Unit setelah jeda)
    if (elements.browserApp) {
        elements.browserApp.addEventListener('click', () => {
            // Membuka link di tab baru
            window.open('https://nekopoi.care/', '_blank'); 
            
            // Tutup Head Unit setelah 500ms untuk memastikan link terbuka tanpa interupsi.
            setTimeout(() => {
                 toggleHeadUnit(false); 
            }, 500); 
        });
    }

    // 5. INISIASI DATA DAN MESIN
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); 
    setSeatbelts(true);
    setHeadlights(1);
    
    setEngine(false); 

    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState);
        });
    }

    // Memulai simulasi mesin ON
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

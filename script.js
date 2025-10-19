document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------
    // --- 1. DOM Elements & Constants ---
    // -------------------------------------------------------------------
    const speedNeedle = document.querySelector('.speed-needle');
    const gearDisplay = document.querySelector('.gear-display');
    const engineCheckLight = document.querySelector('.engine-indicator'); 
    const leftSignal = document.querySelector('.left-signal');
    const rightSignal = document.querySelector('.right-signal');
    
    const analogView = document.getElementById('analog-view');
    const digitalView = document.getElementById('digital-view');
    const uiContainer = document.querySelector('.speedometer-ui'); 
    
    const largeSpeedValue = document.querySelector('.large-speed-value');

    const fuelValueEl = document.querySelector('.fuel-indicator .value');
    const engineValueEl = document.querySelector('.engine-health-indicator .value');
    const fuelIndicatorEl = document.querySelector('.fuel-indicator');
    const engineIndicatorEl = document.querySelector('.engine-health-indicator');

    const navAnalog = document.querySelector('.nav-item[data-view="analog"]');
    const navDigital = document.querySelector('.nav-item[data-view="digital"]');
    
    const MIN_SPEED = 0;
    const MAX_SPEED = 200;
    const START_ANGLE = -135;
    const END_ANGLE = 135;
    const TOTAL_ANGLE = END_ANGLE - START_ANGLE;

    if (!speedNeedle || !analogView || !digitalView || !navAnalog || !navDigital || !uiContainer) {
        console.error("Error: Beberapa elemen DOM utama tidak ditemukan.");
        return;
    }

    // -------------------------------------------------------------------
    // --- 2. Fungsi Pembantu (Internal) ---
    // -------------------------------------------------------------------

    const updateLevelIndicatorColor = (element, value) => {
        if (!element) return;
        if (value > 80) {
            element.style.color = 'var(--level-good)'; 
        } else if (value > 20) {
            element.style.color = 'var(--level-warning)'; 
        } else {
            element.style.color = 'var(--level-critical)'; 
        }
    };
    
    const updateSpeed = (speed) => {
        const safeSpeed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed));
        const percentage = (safeSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);
        const angle = START_ANGLE + percentage * TOTAL_ANGLE;
        
        speedNeedle.style.transform = `translateX(-50%) translateY(calc(var(--gauge-radius) - 90px)) rotate(${angle}deg)`;
        largeSpeedValue.textContent = String(Math.floor(safeSpeed)).padStart(3, '0');
    };
    
    const updateGear = (gear) => {
        gearDisplay.textContent = String(gear).toUpperCase();
    };
    
    const toggleSignal = (side, isActive) => {
        const signalEl = side === 'left' ? leftSignal : rightSignal;
        if (signalEl) {
            signalEl.classList.toggle('active', isActive);
        }
    };
    
    const updateLevels = (fuel, engine) => {
        if (fuelValueEl) fuelValueEl.textContent = `${Math.floor(fuel)}%`;
        if (engineValueEl) engineValueEl.textContent = `${Math.floor(engine)}%`;
        updateLevelIndicatorColor(fuelIndicatorEl, fuel);
        updateLevelIndicatorColor(engineIndicatorEl, engine);
    };

    // -------------------------------------------------------------------
    // --- 3. View Toggle Logic (Analog/Digital) ---
    // -------------------------------------------------------------------
    const toggleView = (viewType) => {
        analogView.classList.add('hidden-view');
        digitalView.classList.add('hidden-view');
        navAnalog.classList.remove('active');
        navDigital.classList.remove('active');

        if (viewType === 'analog') {
            analogView.classList.remove('hidden-view');
            navAnalog.classList.add('active');
        } else if (viewType === 'digital') {
            digitalView.classList.remove('hidden-view');
            navDigital.classList.add('active');
        }
    };

    navAnalog.addEventListener('click', () => toggleView('analog'));
    navDigital.addEventListener('click', () => toggleView('digital'));
    
    // -------------------------------------------------------------------
    // --- 4. EVENT LISTENER UNTUK DATA REAL-TIME (INTI FUNGSIONALITAS) ---
    // -------------------------------------------------------------------
    window.addEventListener('message', (event) => {
        const data = event.data;

        if (data.type === 'updateStatus') {
            
            if (data.speed !== undefined) {
                updateSpeed(data.speed);
            }

            if (data.gear !== undefined) {
                updateGear(data.gear);
            }
            
            if (data.fuel !== undefined && data.engineHealth !== undefined) {
                updateLevels(data.fuel, data.engineHealth);
            }

            if (data.signalLeft !== undefined) {
                toggleSignal('left', data.signalLeft);
            }
            if (data.signalRight !== undefined) {
                toggleSignal('right', data.signalRight);
            }
            
            if (data.engineOn !== undefined) {
                engineCheckLight.classList.toggle('active', data.engineOn);
            }
            
            // Fungsionalitas show/hide UI dari data eksternal
            if (data.show !== undefined) {
                 uiContainer.style.display = data.show ? 'flex' : 'none';
            }
        }
    });

    // -------------------------------------------------------------------
    // --- 5. INITIAL STATE SETUP (Status Awal & Flash) ---
    // -------------------------------------------------------------------
    
    // 5a. Atur status awal (0 KMH, N, 100%)
    toggleView('analog');
    updateSpeed(0);
    updateGear('N');
    updateLevels(100, 100); 
    toggleSignal('left', false);
    toggleSignal('right', false);
    if (engineCheckLight) engineCheckLight.classList.remove('active'); 

    // 5b. Tampilkan UI secara default (memastikan terlihat)
    uiContainer.style.display = 'flex'; 
    
    // 5c. HAPUS FUNGSI TIMEOUT (KODE ASLI YANG MENYEBABKAN UI HILANG)
    /*
    setTimeout(() => {
        uiContainer.style.display = 'none';
    }, 500); 
    */
    
    // UI kini akan tetap terlihat ('flex') sampai ada perintah 'data.show = false' dari luar.
});

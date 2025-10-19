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
    
    const largeSpeedValue = document.querySelector('.large-speed-value');

    const fuelValueEl = document.querySelector('.fuel-indicator .value');
    const engineValueEl = document.querySelector('.engine-health-indicator .value');
    const fuelIndicatorEl = document.querySelector('.fuel-indicator');
    const engineIndicatorEl = document.querySelector('.engine-health-indicator');

    const navAnalog = document.querySelector('.nav-item[data-view="analog"]');
    const navDigital = document.querySelector('.nav-item[data-view="digital"]');
    
    // Konstanta Sudut Jarum
    const MIN_SPEED = 0;
    const MAX_SPEED = 200;
    const START_ANGLE = -135;
    const END_ANGLE = 135;
    const TOTAL_ANGLE = END_ANGLE - START_ANGLE;

    if (!speedNeedle || !analogView || !digitalView || !navAnalog || !navDigital) {
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
        // Nonaktifkan semua view dan tombol nav
        analogView.classList.add('hidden-view');
        digitalView.classList.add('hidden-view');
        navAnalog.classList.remove('active');
        navDigital.classList.remove('active');

        // Tampilkan view yang dipilih
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

        // Cek tipe data, seperti pada template GitHub
        if (data.type === 'updateStatus') {
            
            if (data.speed !== undefined) {
                updateSpeed(data.speed);
            }

            if (data.gear !== undefined) {
                updateGear(data.gear);
            }
            
            // Menggunakan properti fuel dan engineHealth sesuai template GitHub
            if (data.fuel !== undefined && data.engineHealth !== undefined) {
                updateLevels(data.fuel, data.engineHealth);
            }

            if (data.signalLeft !== undefined) {
                toggleSignal('left', data.signalLeft);
            }
            if (data.signalRight !== undefined) {
                toggleSignal('right', data.signalRight);
            }
            
            // Engine On/Off
            if (data.engineOn !== undefined) {
                engineCheckLight.classList.toggle('active', data.engineOn);
            }
            
            // Tambahan: Jika Anda memiliki logika untuk menunjukkan/menyembunyikan UI
            if (data.show !== undefined) {
                 const uiContainer = document.querySelector('.speedometer-ui');
                 if (uiContainer) {
                     uiContainer.style.display = data.show ? 'flex' : 'none';
                 }
            }
        }
    });

    // -------------------------------------------------------------------
    // --- 5. INITIAL STATE SETUP (Status Awal) ---
    // -------------------------------------------------------------------
    toggleView('analog');
    updateSpeed(0);
    updateGear('N');
    updateLevels(100, 100); 
    toggleSignal('left', false);
    toggleSignal('right', false);
    if (engineCheckLight) engineCheckLight.classList.remove('active'); 
});

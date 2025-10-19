document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------
    // --- 1. DOM Elements ---
    // Menggunakan querySelector karena elemen-elemen ini tidak memiliki ID unik
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
    
    // Safety check
    if (!speedNeedle || !analogView || !digitalView || !navAnalog || !navDigital) {
        console.error("Kesalahan: Beberapa elemen DOM utama tidak ditemukan. Pastikan HTML Anda sudah benar.");
        return;
    }

    // -------------------------------------------------------------------
    // --- 2. Constants & Core Functions ---
    // -------------------------------------------------------------------
    const MIN_SPEED = 0;
    const MAX_SPEED = 200;
    const START_ANGLE = -135;
    const END_ANGLE = 135;
    const TOTAL_ANGLE = END_ANGLE - START_ANGLE;

    // Function to calculate needle angle
    const setNeedle = (speed) => {
        const percentage = Math.min(1, Math.max(0, (speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)));
        const angle = START_ANGLE + percentage * TOTAL_ANGLE;
        
        if (speedNeedle) {
             speedNeedle.style.transform = `translateX(-50%) translateY(calc(var(--gauge-radius) - 90px)) rotate(${angle}deg)`;
        }
        
        if (largeSpeedValue) {
            largeSpeedValue.textContent = String(Math.floor(speed)).padStart(3, '0');
        }
    };

    // Function to update Fuel and Engine Health colors
    const updateLevelIndicatorColor = (element, value) => {
        if (!element) return;
        
        if (value > 80) {
            element.style.color = 'var(--level-good)'; // Hijau
        } else if (value > 20) {
            element.style.color = 'var(--level-warning)'; // Oranye
        } else {
            element.style.color = 'var(--level-critical)'; // Merah
        }
    };

    // -------------------------------------------------------------------
    // --- 3. Simulation Variables & Loop ---
    // -------------------------------------------------------------------
    let currentSpeed = 0;
    let currentGear = 'N';
    let isEngineOn = true;
    let isLeftSignalActive = true;
    let isRightSignalActive = false;
    let fuelPercentage = 98;
    let engineHealth = 99;


    const simulate = () => {
        // SIMULATE SPEED
        currentSpeed = Math.min(MAX_SPEED, currentSpeed + 1);
        if (currentSpeed >= MAX_SPEED) currentSpeed = MIN_SPEED;
        setNeedle(currentSpeed);

        // SIMULATE GEAR SHIFT 
        if (currentSpeed > 50 && currentGear === 'N') currentGear = '1';
        else if (currentSpeed > 80 && currentGear === '1') currentGear = '2';
        else if (currentSpeed > 120 && currentGear === '2') currentGear = '3';
        else if (currentSpeed < 10) currentGear = 'N';
        if (gearDisplay) gearDisplay.textContent = currentGear;


        // SIMULATE FUEL & ENGINE HEALTH
        if (fuelPercentage > 0) fuelPercentage = Math.max(0, fuelPercentage - 0.1); 
        if (engineHealth > 0) engineHealth = Math.max(0, engineHealth - 0.05); 

        if (fuelValueEl) fuelValueEl.textContent = `${Math.floor(fuelPercentage)}%`;
        if (engineValueEl) engineValueEl.textContent = `${Math.floor(engineHealth)}%`;

        updateLevelIndicatorColor(fuelIndicatorEl, fuelPercentage);
        updateLevelIndicatorColor(engineIndicatorEl, engineHealth);
        
        // SIMULATE TURN SIGNALS (Blinking)
        // Sinyal belok bergantian aktif setiap loop simulasi
        isLeftSignalActive = !isLeftSignalActive; 
        isRightSignalActive = !isRightSignalActive; 
        if (leftSignal) leftSignal.classList.toggle('active', isLeftSignalActive);
        if (rightSignal) rightSignal.classList.toggle('active', isRightSignalActive);
    };

    // Start simulation loop (Update setiap 200ms)
    setInterval(simulate, 200);

    // Initial setup
    if (engineCheckLight) engineCheckLight.classList.toggle('active', isEngineOn);

    
    // -------------------------------------------------------------------
    // --- 4. View Toggle Logic (Fitur Klik) ---
    // -------------------------------------------------------------------
    const toggleView = (viewType) => {
        // Hapus kelas aktif dari semua tombol navigasi
        navAnalog.classList.remove('active');
        navDigital.classList.remove('active');

        if (viewType === 'analog') {
            analogView.classList.remove('hidden-view');
            digitalView.classList.add('hidden-view');
            navAnalog.classList.add('active');
        } else if (viewType === 'digital') {
            analogView.classList.add('hidden-view');
            digitalView.classList.remove('hidden-view');
            navDigital.classList.add('active');
        }
    };

    // Tambahkan event listener untuk tombol navigasi
    navAnalog.addEventListener('click', () => toggleView('analog'));
    navDigital.addEventListener('click', () => toggleView('digital'));
    
    // Set tampilan awal
    toggleView('analog');
});

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------
    // --- 1. DOM Elements (Diperbaiki agar sesuai dengan HTML terakhir) ---
    // -------------------------------------------------------------------

    // Speedometer & Gear (Menggunakan querySelector karena tidak ada ID pada HTML terakhir)
    const speedNeedle = document.querySelector('.speed-needle');
    const gearDisplay = document.querySelector('.gear-display');
    const engineCheckLight = document.querySelector('.engine-indicator'); // Mengganti ID yang salah
    const leftSignal = document.querySelector('.left-signal');
    const rightSignal = document.querySelector('.right-signal');
    
    // Views
    const analogView = document.getElementById('analog-view');
    const digitalView = document.getElementById('digital-view');
    const largeSpeedValue = document.querySelector('.large-speed-value'); // Mengganti ID yang salah

    // Fuel & Engine Health
    // Menggunakan querySelector untuk elemen yang berisi nilai (children dari .fuel-indicator)
    const fuelValueEl = document.querySelector('.fuel-indicator .value');
    const engineValueEl = document.querySelector('.engine-health-indicator .value');
    const fuelIndicatorEl = document.querySelector('.fuel-indicator');
    const engineIndicatorEl = document.querySelector('.engine-health-indicator');

    // Navigasi (Menggunakan querySelector berdasarkan data-view karena tidak ada ID)
    const navAnalog = document.querySelector('.nav-item[data-view="analog"]');
    const navDigital = document.querySelector('.nav-item[data-view="digital"]');
    
    // Pastikan semua elemen penting ditemukan
    if (!speedNeedle || !analogView || !digitalView || !navAnalog || !navDigital) {
        console.error("Kesalahan: Beberapa elemen DOM utama tidak ditemukan.");
        return;
    }


    // -------------------------------------------------------------------
    // --- 2. Constants & Core Functions (Tidak ada perubahan di sini) ---
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
        
        // Cek apakah speedNeedle ada sebelum mencoba mengakses style-nya
        if (speedNeedle) {
             speedNeedle.style.transform = `translateX(-50%) translateY(calc(var(--gauge-radius) - 90px)) rotate(${angle}deg)`;
        }
        
        // Cek apakah largeSpeedValue ada sebelum mencoba mengakses textContent-nya
        if (largeSpeedValue) {
            largeSpeedValue.textContent = String(Math.floor(speed)).padStart(3, '0');
        }
    };

    // Function to update Fuel and Engine Health colors
    const updateLevelIndicatorColor = (element, value) => {
        // Tidak perlu menghapus class karena sekarang kita menggunakan style.color
        if (value > 80) {
            element.style.color = 'var(--level-good)'; // Hijau
        } else if (value > 20) {
            element.style.color = 'var(--level-warning)'; // Oranye
        } else {
            element.style.color = 'var(--level-critical)'; // Merah
        }
    };

    // -------------------------------------------------------------------
    // --- 3. Simulation & Initial Setup (Disesuaikan sedikit) ---
    // -------------------------------------------------------------------
    let currentSpeed = 0;
    let currentGear = 'N';
    let isEngineOn = true;
    let isLeftSignalActive = true;
    let isRightSignalActive = false;
    let totalKm = 0.003;
    let fuelPercentage = 98;
    let engineHealth = 99;


    const simulate = () => {
        // 1. SIMULATE SPEED (for demonstration)
        currentSpeed = Math.min(MAX_SPEED, currentSpeed + 1);
        if (currentSpeed >= MAX_SPEED) currentSpeed = MIN_SPEED;
        setNeedle(currentSpeed);

        // 2. SIMULATE TOTAL KM (Dihilangkan karena elemen KM disembunyikan di CSS)
        totalKm += currentSpeed / 3600; 

        // 3. SIMULATE GEAR SHIFT 
        if (currentSpeed > 50 && currentGear === 'N') currentGear = '1';
        else if (currentSpeed > 80 && currentGear === '1') currentGear = '2';
        else if (currentSpeed > 120 && currentGear === '2') currentGear = '3';
        else if (currentSpeed < 10) currentGear = 'N';
        if (gearDisplay) gearDisplay.textContent = currentGear;


        // 4. SIMULATE FUEL & ENGINE HEALTH
        if (fuelPercentage > 0) fuelPercentage = Math.max(0, fuelPercentage - 0.1); 
        if (engineHealth > 0) engineHealth = Math.max(0, engineHealth - 0.05); 

        if (fuelValueEl) fuelValueEl.textContent = `${Math.floor(fuelPercentage)}%`;
        if (engineValueEl) engineValueEl.textContent = `${Math.floor(engineHealth)}%`;

        if (fuelIndicatorEl) updateLevelIndicatorColor(fuelIndicatorEl, fuelPercentage);
        if (engineIndicatorEl) updateLevelIndicatorColor(engineIndicatorEl, engineHealth);
        
        // 5. SIMULATE TURN SIGNALS (Blinking)
        isLeftSignalActive = !isLeftSignalActive; 
        isRightSignalActive = !isRightSignalActive; 
        if (leftSignal) leftSignal.classList.toggle('active', isLeftSignalActive);
        if (rightSignal) rightSignal.classList.toggle('active', isRightSignalActive);
    };

    // Start simulation loop
    setInterval(simulate, 200);

    // Initial setup
    if (engineCheckLight) engineCheckLight.classList.toggle('active', isEngineOn); // Initial engine light state

    
    // -------------------------------------------------------------------
    // --- 4. View Toggle Logic (Perbaikan utama) ---
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
    
    // Hapus listener yang tidak digunakan (document.getElementById('toggle-view'))
    
    // Initial view set
    toggleView('analog');
});

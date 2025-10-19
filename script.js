document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------
    // --- 1. DOM Elements ---
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
        console.error("Error: Beberapa elemen DOM utama tidak ditemukan. Pastikan HTML Anda sudah benar.");
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

    // Fungsi untuk memperbarui warna level indikator
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
    // --- 3. FUNGSI UTAMA (API Fungsionalitas Asli) ---
    // Ini adalah fungsi yang siap Anda panggil dari data nyata.
    // -------------------------------------------------------------------

    /**
     * Memperbarui jarum speedometer dan tampilan speed digital.
     * @param {number} speed - Kecepatan saat ini (0-200).
     */
    window.updateSpeed = (speed) => {
        const safeSpeed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed));
        const percentage = (safeSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);
        const angle = START_ANGLE + percentage * TOTAL_ANGLE;
        
        if (speedNeedle) {
             speedNeedle.style.transform = `translateX(-50%) translateY(calc(var(--gauge-radius) - 90px)) rotate(${angle}deg)`;
        }
        
        if (largeSpeedValue) {
            largeSpeedValue.textContent = String(Math.floor(safeSpeed)).padStart(3, '0');
        }
    };
    
    /**
     * Memperbarui tampilan gear.
     * @param {string} gear - Nilai gear (contoh: "N", "1", "2", "R").
     */
    window.updateGear = (gear) => {
        if (gearDisplay) gearDisplay.textContent = String(gear).toUpperCase();
    };

    /**
     * Memperbarui level Fuel dan Engine Health serta warnanya.
     * @param {number} fuel - Persentase fuel (0-100).
     * @param {number} engine - Persentase Engine Health (0-100).
     */
    window.updateLevels = (fuel, engine) => {
        if (fuelValueEl) fuelValueEl.textContent = `${Math.floor(fuel)}%`;
        if (engineValueEl) engineValueEl.textContent = `${Math.floor(engine)}%`;

        updateLevelIndicatorColor(fuelIndicatorEl, fuel);
        updateLevelIndicatorColor(engineIndicatorEl, engine);
    };

    /**
     * Mengaktifkan atau menonaktifkan lampu sinyal belok.
     * @param {string} side - 'left' atau 'right'.
     * @param {boolean} isActive - True untuk menyala, False untuk mati.
     */
    window.toggleSignal = (side, isActive) => {
        const signalEl = side === 'left' ? leftSignal : rightSignal;
        if (signalEl) {
            signalEl.classList.toggle('active', isActive);
        }
    };

    // -------------------------------------------------------------------
    // --- 4. View Toggle Logic (Fitur Klik) ---
    // -------------------------------------------------------------------
    const toggleView = (viewType) => {
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

    // -------------------------------------------------------------------
    // --- 5. INITIAL STATE SETUP (Status Awal) ---
    // Atur semua indikator ke posisi mati/standar saat UI dimuat.
    // -------------------------------------------------------------------
    window.updateSpeed(0);
    window.updateGear('N');
    window.updateLevels(100, 100); // Mulai dari 100%
    
    // Nonaktifkan Sein
    window.toggleSignal('left', false);
    window.toggleSignal('right', false);
    
    // Nonaktifkan Engine Light
    if (engineCheckLight) engineCheckLight.classList.remove('active'); 
});

/*
    CONTOH CARA MENGGUNAKAN FUNGSI BARU (jika Anda ingin menguji di konsol):
    
    // Kecepatan 120 KMH
    updateSpeed(120); 

    // Gear ke 3
    updateGear('3');

    // Fuel 15%, Engine 85%
    updateLevels(15, 85);

    // Aktifkan Sein Kiri (harus Anda panggil berulang untuk membuat kedip)
    toggleSignal('left', true); 
*/

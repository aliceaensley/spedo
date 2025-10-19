/**
 * Konfigurasi Utama Speedometer dan API Key.
 */
const API_KEY = "AIzaSyBXQ0vrsQPFnj9Dif2CM_ihZ5pBZDBDKjw"; // API Key baru yang Anda berikan
const MAX_SPEED = 200; // Kecepatan maksimum untuk speedometer analog
const MAX_RPM = 8000;  // RPM maksimum untuk bar analog

// --- Elemen DOM ---
const digitalSpeedView = document.getElementById('digital-speed-view');
const analogSpeedView = document.getElementById('analog-speed-view');
const speedValueElement = document.querySelector('.speed-value');
const rpmBar = document.querySelector('.rpm-bar');
const speedNeedle = document.querySelector('.speed-needle');
const gearDisplay = document.getElementById('gear-display');
const infoTime = document.getElementById('info-time');
const infoFuel = document.getElementById('info-fuel');
const infoEngine = document.getElementById('info-engine');
const welcomeOverlay = document.getElementById('welcome-overlay');
const speedometerContainer = document.querySelector('.speedometer-container');
const modeToggleButton = document.getElementById('mode-toggle-button');
const youtubeToggleButton = document.getElementById('youtube-toggle-button');

// --- Status Awal ---
let currentMode = 'analog';
let isYouTubeActive = false;
let isLoaded = false;


// =========================================================
//  1. FUNGSI UTAMA (INIT & DATA UPDATE)
// =========================================================

/**
 * Inisialisasi speedometer saat DOM dimuat.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Tampilkan overlay selamat datang sebentar
    setTimeout(() => {
        welcomeOverlay.classList.add('fade-out');
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 1000); // Tunggu 1 detik setelah fade out selesai

        // Setelah overlay hilang, set mode awal
        setSpeedometerMode(currentMode);
        isLoaded = true;
    }, 2000); // Tampilkan overlay selama 2 detik
    
    // Setup event listeners
    setupEventListeners();

    // Mulai update jam
    setInterval(updateTime, 1000); 
    updateTime();
});

/**
 * Memperbarui tampilan speedometer dengan data terbaru dari game/backend.
 * @param {number} speed - Kecepatan kendaraan.
 * @param {number} rpm - Rotasi per menit mesin (0.0 - 1.0).
 * @param {number} gear - Gigi transmisi.
 * @param {number} fuel - Persentase bahan bakar (0 - 100).
 * @param {number} engineHealth - Persentase kesehatan mesin (0 - 100).
 * @param {boolean} lights - Status lampu menyala.
 * @param {boolean} seatbelt - Status sabuk pengaman terpasang.
 */
function updateSpeedometer(speed, rpm, gear, fuel, engineHealth, lights, seatbelt) {
    if (!isLoaded) return;

    // A. Update Mode Digital
    speedValueElement.textContent = Math.round(speed);
    
    // B. Update Mode Analog
    // Jarum speed (dari -135 derajat hingga 135 derajat)
    const speedRatio = Math.min(speed / MAX_SPEED, 1);
    const rotation = -135 + (speedRatio * 270);
    speedNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    // RPM Bar (dari 0% hingga 100%)
    const rpmPercentage = rpm * 100;
    rpmBar.style.width = `${rpmPercentage}%`;

    // C. Update Info Grid
    infoFuel.textContent = `${Math.round(fuel)}%`;
    infoEngine.textContent = `${Math.round(engineHealth)}%`;
    
    // D. Update Indicators
    updateIndicators(gear, lights, seatbelt);
}


// =========================================================
//  2. KONTROL MODE & TOGGLE
// =========================================================

/**
 * Mengubah mode tampilan speedometer (analog atau digital).
 * @param {string} mode - 'analog' atau 'digital'.
 */
function setSpeedometerMode(mode) {
    currentMode = mode;
    if (mode === 'analog') {
        digitalSpeedView.style.display = 'none';
        analogSpeedView.style.display = 'block';
        modeToggleButton.innerHTML = '<i class="fas fa-clock"></i> Analog';
        modeToggleButton.classList.add('active');
    } else {
        digitalSpeedView.style.display = 'block';
        analogSpeedView.style.display = 'none';
        modeToggleButton.innerHTML = '<i class="fas fa-digital-tachograph"></i> Digital';
        modeToggleButton.classList.remove('active');
    }
}

/**
 * Mengaktifkan atau menonaktifkan tampilan YouTube.
 */
function toggleYouTubeView() {
    isYouTubeActive = !isYouTubeActive;
    
    if (isYouTubeActive) {
        speedometerContainer.classList.add('youtube-active');
        youtubeToggleButton.classList.add('active');
        // Panggil fungsi untuk menampilkan YouTube UI
        showYouTubeUI(); 
    } else {
        speedometerContainer.classList.remove('youtube-active');
        youtubeToggleButton.classList.remove('active');
        // Panggil fungsi untuk menyembunyikan YouTube UI
        hideYouTubeUI(); 
    }
}

/**
 * Menyiapkan semua event listener untuk tombol dan kontrol.
 */
function setupEventListeners() {
    // Tombol Toggle Mode Analog/Digital
    modeToggleButton.addEventListener('click', () => {
        const newMode = (currentMode === 'analog') ? 'digital' : 'analog';
        setSpeedometerMode(newMode);
    });
    
    // Tombol Toggle YouTube
    youtubeToggleButton.addEventListener('click', toggleYouTubeView);
}


// =========================================================
//  3. FUNGSI TAMBAHAN (JAM, INDIKATOR)
// =========================================================

/**
 * Memperbarui tampilan jam.
 */
function updateTime() {
    const now = new Date();
    // Gunakan format 24 jam HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    infoTime.textContent = `${hours}:${minutes}`;
}

/**
 * Memperbarui status ikon indikator.
 */
function updateIndicators(gear, lights, seatbelt) {
    // 1. Gear
    const gearText = (gear === 0) ? 'N' : (gear === -1) ? 'R' : gear;
    gearDisplay.textContent = gearText;

    // 2. Lampu (di panel bawah)
    const lightIcon = document.getElementById('light-icon');
    if (lights) {
        lightIcon.classList.add('active');
    } else {
        lightIcon.classList.remove('active');
    }

    // 3. Sabuk Pengaman (di panel bawah)
    const seatbeltIcon = document.getElementById('seatbelt-icon');
    if (seatbelt) {
        seatbeltIcon.classList.add('active');
    } else {
        seatbeltIcon.classList.remove('active');
    }
}


// =========================================================
//  4. FUNGSI YOUTUBE (TEMPAT API KEY DIGUNAKAN)
// =========================================================

function showYouTubeUI() {
    // Logika untuk menampilkan input pencarian YouTube, tombol, dan iframe/container video.
    // Biasanya ini melibatkan:
    // 1. Membuat atau menampilkan elemen HTML .youtube-integrated-container
    // 2. Menggunakan API_KEY untuk membuat panggilan ke YouTube Data API (Search)
    console.log("YouTube View Activated. API Key ready for search.");
    // Contoh: document.getElementById('youtube-container').style.display = 'flex';
}

function hideYouTubeUI() {
    // Logika untuk menyembunyikan YouTube UI.
    console.log("YouTube View Deactivated.");
    // Contoh: document.getElementById('youtube-container').style.display = 'none';
}


// =========================================================
//  5. FUNGSI EXPOSURE GLOBAL (Untuk Komunikasi Backend/Game)
// =========================================================

// Di lingkungan FiveM atau sejenisnya, fungsi ini mungkin dipanggil dari backend.
// Pastikan fungsi ini dapat diakses secara global (misalnya: window.updateSpeedometer).

window.updateSpeedometer = updateSpeedometer;

// Catatan: Jika Anda menggunakan framework seperti Vue/React/jQuery, 
// struktur kode akan berbeda dan menggunakan API key di dalam layanan framework tersebut.

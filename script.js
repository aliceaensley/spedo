/**
 * Konfigurasi Utama Speedometer dan API Key.
 */
// Ganti dengan API Key yang Anda berikan
const API_KEY = "AIzaSyBXQ0vrsQPFnj9Dif2CM_ihZ5pBZDBDKjw"; 
const MAX_SPEED = 200; 
const MAX_RPM = 1.0; // RPM biasanya 0.0 sampai 1.0 dalam game/mod


// --- Elemen DOM ---
// Speed & View
const digitalSpeedView = document.getElementById('digital-speed-view');
const analogSpeedView = document.getElementById('analog-speed-view');
const speedometerContainer = document.querySelector('.speedometer-container');
const speedValueElement = document.querySelector('.speed-value');
const speedNeedle = document.querySelector('.speed-needle');
const rpmBar = document.querySelector('.rpm-bar');

// Toggles & Mode
const modeToggleButton = document.getElementById('mode-toggle-button'); // Harusnya ada ID ini di HTML
const youtubeToggleButton = document.getElementById('youtube-toggle-button'); // Harusnya ada ID ini di HTML

// Info Grid & Indicators (Asumsi ID/Class ini ada di HTML Anda)
const infoTime = document.getElementById('info-time'); // Di dalam stat-item Time
const infoFuel = document.getElementById('info-fuel'); // Di dalam stat-item Fuel
const infoEngine = document.getElementById('info-engine'); // Di dalam stat-item Engine
const gearDisplay = document.getElementById('gear-display'); // Asumsi untuk menampilkan N, R, 1, 2, dll.

const lightIcon = document.getElementById('light-icon'); // Ikon bohlam
const seatbeltIcon = document.getElementById('seatbelt-icon'); // Ikon kursi/sabuk

// Overlay
const welcomeOverlay = document.getElementById('welcome-overlay'); 

// --- Status Awal ---
let currentMode = 'analog';
let isYouTubeActive = false;
let isLoaded = false;


// =========================================================
//  1. FUNGSI UTAMA (INIT & DATA UPDATE)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Overlay
    setTimeout(() => {
        welcomeOverlay.classList.add('fade-out');
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 1000); 
        setSpeedometerMode(currentMode);
        isLoaded = true;
    }, 2000); 
    
    // 2. Setup Listeners
    setupEventListeners();

    // 3. Mulai update jam
    setInterval(updateTime, 1000); 
    updateTime();
});

/**
 * Memperbarui tampilan speedometer dengan data terbaru.
 * Ini adalah fungsi yang harus dipanggil oleh backend/game Anda.
 */
function updateSpeedometer(speed, rpm, gear, fuel, engineHealth, lights, seatbelt) {
    if (!isLoaded) return;

    // A. Update Mode Digital
    speedValueElement.textContent = Math.round(speed);
    
    // B. Update Mode Analog
    // Jarum speed: Rotasi dari -135deg (0) hingga 135deg (MAX_SPEED)
    const speedRatio = Math.min(speed / MAX_SPEED, 1);
    const rotation = -135 + (speedRatio * 270);
    speedNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    // RPM Bar: rpm (0.0 - 1.0) dikonversi ke persentase
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
 */
function setSpeedometerMode(mode) {
    currentMode = mode;
    if (mode === 'analog') {
        digitalSpeedView.style.display = 'none';
        analogSpeedView.style.display = 'block';
        // Asumsi tombol mode toggle adalah ikon Analog di HTML
        if (modeToggleButton) modeToggleButton.classList.add('active'); 
    } else {
        digitalSpeedView.style.display = 'block';
        analogSpeedView.style.display = 'none';
        if (modeToggleButton) modeToggleButton.classList.remove('active');
    }
}

/**
 * Mengaktifkan atau menonaktifkan tampilan YouTube.
 */
function toggleYouTubeView() {
    isYouTubeActive = !isYouTubeActive;
    
    if (isYouTubeActive) {
        speedometerContainer.classList.add('youtube-active');
        if (youtubeToggleButton) youtubeToggleButton.classList.add('active');
        showYouTubeUI(); 
    } else {
        speedometerContainer.classList.remove('youtube-active');
        if (youtubeToggleButton) youtubeToggleButton.classList.remove('active');
        hideYouTubeUI(); 
    }
}

/**
 * Menyiapkan semua event listener untuk tombol dan kontrol.
 */
function setupEventListeners() {
    if (modeToggleButton) {
        modeToggleButton.addEventListener('click', () => {
            const newMode = (currentMode === 'analog') ? 'digital' : 'analog';
            setSpeedometerMode(newMode);
        });
    }
    
    if (youtubeToggleButton) {
        youtubeToggleButton.addEventListener('click', toggleYouTubeView);
    }
}


// =========================================================
//  3. FUNGSI TAMBAHAN
// =========================================================

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (infoTime) infoTime.textContent = `${hours}:${minutes}`;
}

function updateIndicators(gear, lights, seatbelt) {
    // Gear Display
    const gearText = (gear === 0) ? 'N' : (gear === -1) ? 'R' : gear;
    if (gearDisplay) gearDisplay.textContent = gearText;

    // Lampu
    if (lightIcon) {
        lightIcon.classList.toggle('active', lights);
    }

    // Sabuk Pengaman
    if (seatbeltIcon) {
        seatbeltIcon.classList.toggle('active', seatbelt);
    }
}

// =========================================================
//  4. FUNGSI YOUTUBE (TEMPAT API KEY DIGUNAKAN)
// =========================================================

function showYouTubeUI() {
    // Logika untuk menampilkan input pencarian YouTube dan memulai pencarian/video.
    console.log(`YouTube UI is ready. Using API Key: ${API_KEY.substring(0, 10)}...`);
    // Di sini Anda akan menambahkan kode untuk membuat iframe YouTube dan 
    // memulai fungsi pencarian yang membutuhkan API_KEY.
}

function hideYouTubeUI() {
    // Logika untuk menyembunyikan YouTube UI.
    console.log("YouTube UI hidden.");
}


// =========================================================
//  5. FUNGSI EXPOSURE GLOBAL
// =========================================================

// Ekspos fungsi utama untuk dipanggil oleh lingkungan game/backend
window.updateSpeedometer = updateSpeedometer;

// --- DEMO ---
// window.onload = () => {
//     setInterval(() => {
//         const randomSpeed = Math.random() * 150;
//         const randomRpm = Math.random(); 
//         const randomGear = Math.floor(Math.random() * 5);
//         const randomFuel = Math.random() * 100;
//         const randomEngine = Math.random() * 100;
//         const randomLights = Math.random() > 0.7;
//         const randomSeatbelt = Math.random() > 0.5;
//         
//         updateSpeedometer(randomSpeed, randomRpm, randomGear, randomFuel, randomEngine, randomLights, randomSeatbelt);
//     }, 500);
// };

let elements = {};
let speedMode = 1; // 1: MPH (default)
let engineState = false; 
let headlightsState = 0; 
let seatbeltState = false; 
let isYoutubeOpen = false;
let simulationInterval = null; 
let timeInterval = null; 

// *****************************************************************
// Kunci API YouTube - HARUS DIGANTI!
// *****************************************************************
const YOUTUBE_API_KEY = 'AIzaSyBXQ0vrsQPFnj9Dif2CM_ihZ5pBZDBDKjw'; // Kunci Contoh, TIDAK AKAN BERFUNGSI!
// *****************************************************************

// --- KONSTANTA SIMULASI STABIL ---
const IDLE_RPM_VALUE = 1000; // RPM Idle yang ditampilkan di UI
const IDLE_SPEED_MS = 0.2; // Batas kecepatan (m/s) di mana mobil dianggap berhenti.

// --- FUNGSI UTILITY ---

const toggleIconActive = (element, state) => {
    if (element) {
        element.classList.toggle('active', state);
    }
};

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    if (elements.time) {
        elements.time.innerText = `${hours}:${minutes}`;
    }
}


// --- FUNGSI PEMBARUAN DATA ---

function setEngine(state) {
    engineState = state;
    toggleIconActive(elements.engineIcon, state);
    if (state) {
        startSimulation();
    } else {
        stopSimulation();
    }
}

function setSpeed(speed) {
    let speedValue;
    const absSpeed = Math.abs(speed); 
    
    switch(speedMode)
    {
        case 1: speedValue = Math.round(absSpeed * 2.236936); break; 
        case 2: speedValue = Math.round(absSpeed * 1.943844); break; 
        default: speedValue = Math.round(absSpeed * 3.6); 
    }
    
    const displayValue = String(speedValue).padStart(3, '0');
    if (elements.speed) elements.speed.innerText = displayValue;
}

function setRPM(rpm) {
    // RPM masuk sebagai 0.0-1.0 (skala 0-10000)
    const rpmValue = Math.round(rpm * 10000);
    elements.rpm.innerText = `${rpmValue}`;
}

function setFuel(fuel) {
    // Simulasi penuaan data vital
    if (elements.fuel) elements.fuel.innerText = `${Math.round(fuel * 100)}%`;
}

function setHealth(health) {
    if (elements.health) elements.health.innerText = `${Math.round(health * 100)}%`;
}

function setHeadlights(state) {
    headlightsState = state;
    toggleIconActive(elements.headlightsIcon, state > 0);
}

function setSeatbelts(state) {
    seatbeltState = state;
    toggleIconActive(elements.seatbeltsIcon, state);
}

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


// --- KONTROL SIMULASI ---

function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    setSpeed(0);
    // RPM di set ke 0000 saat mesin dimatikan
    setRPM(0.0); 
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    const RPM_BASE_FLOAT = IDLE_RPM_VALUE / 10000; // 0.10 untuk 1000 RPM
    
    setSpeed(0);
    setRPM(RPM_BASE_FLOAT); // RPM awal 1000
    
    let accelerationRate = 0.5; 
    let decelerationRate = 0.1; 

    simulationInterval = setInterval(() => {
        
        let targetSpeedChange = 0;
        let action = Math.random();
        
        // Logika Dinamis: (50% Aksel, 30% Desel, 20% Cruising)
        if (action < 0.5) { 
            targetSpeedChange = accelerationRate * Math.random(); 
        } else if (action < 0.8) { 
            targetSpeedChange = -decelerationRate * Math.random() * 2; 
        } else {
            targetSpeedChange = (Math.random() - 0.5) * 0.1;
        }

        currentSpeed += targetSpeedChange;
        
        // Drag dan Batas Bawah
        if (currentSpeed > 0) currentSpeed *= 0.98;
        if (currentSpeed < IDLE_SPEED_MS) currentSpeed = 0; 
        currentSpeed = Math.max(0, currentSpeed);
        
        const isIdle = (currentSpeed === 0);
        
        if (isIdle) {
            setSpeed(0);
            setRPM(RPM_BASE_FLOAT); // Kunci di 1000
        } else {
            setSpeed(currentSpeed);
            
            // Logika RPM: Proporsional dengan speed, minimum di IDLE
            let currentRPM = RPM_BASE_FLOAT + (currentSpeed * 0.007);
            currentRPM = Math.min(0.99, currentRPM); 
            currentRPM += (Math.random() - 0.5) * 0.02; // Noise
            
            setRPM(currentRPM);
        }
        
    }, 100); 
}


// --- FUNGSI YOUTUBE ---

function toggleYoutubeUI(state) {
    const wrapper = elements.youtubeUIWrapper;
    
    if (state === undefined) {
        state = !isYoutubeOpen;
    }

    isYoutubeOpen = state;
    
    if (wrapper) {
        wrapper.classList.toggle('hidden', !state);
        toggleIconActive(elements.youtubeToggleIcon, state);
        if (state) {
            elements.youtubeSearchInput.focus();
        } else {
            // Optional: Hentikan video saat ditutup
            elements.browserIframe.src = "";
        }
    }
}

async function searchYoutube(query) {
    if (!query || !YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'AIzaSyBXQ0vrsQPFnj9Dif2CM_ihZ5pBZDBDKjw') {
         elements.youtubeWarning.classList.remove('hidden');
         return;
    }
    
    // Logika pencarian YouTube...
    elements.youtubeWarning.classList.add('hidden');
    elements.youtubeResults.innerHTML = '<p style="color:#ffaa00; text-align: center;">Mencari...</p>';
    
    // (Implementasi fetch API dihilangkan karena membutuhkan kunci valid)
    // Asumsi: Jika berhasil, results ditampilkan, jika gagal, warning muncul.
    
    // Simulasi kegagalan karena kunci contoh
    setTimeout(() => {
        elements.youtubeResults.innerHTML = '';
        elements.youtubeWarning.classList.remove('hidden');
    }, 1500);
}


// --- INISIALISASI ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        time: document.getElementById('time'), 
        speedMode: document.getElementById('speed-mode'),

        // Ikon
        engineIcon: document.getElementById('engine-icon'), 
        headlightsIcon: document.getElementById('headlights-icon'), 
        seatbeltsIcon: document.getElementById('seatbelts-icon'), 
        youtubeToggleIcon: document.getElementById('youtube-toggle-icon'),

        // YouTube UI
        youtubeUIWrapper: document.getElementById('youtube-ui-wrapper'),
        youtubeSearchInput: document.getElementById('youtube-search-input'),
        youtubeSearchButton: document.getElementById('youtube-search-button'),
        youtubeWarning: document.getElementById('youtube-warning'),
        youtubeResults: document.getElementById('youtube-results'),
        browserIframe: document.getElementById('browser-iframe'),
        youtubeHideButton: document.getElementById('youtube-hide-button'),
    };
    
    // 2. Setup Jam
    updateTime(); 
    timeInterval = setInterval(updateTime, 1000); 
    
    // 3. Inisialisasi Data Awal
    setSpeedMode(1); // MPH
    setEngine(false); // Mesin Mati
    setFuel(0.49); 
    setHealth(1.0); 

    // 4. Setup Interaksi (Ikon Klik)
    if (elements.engineIcon) elements.engineIcon.addEventListener('click', () => setEngine(!engineState));
    if (elements.headlightsIcon) elements.headlightsIcon.addEventListener('click', () => setHeadlights(!headlightsState ? 1 : 0));
    if (elements.seatbeltsIcon) elements.seatbeltsIcon.addEventListener('click', () => setSeatbelts(!seatbeltState));
    
    // YouTube
    if (elements.youtubeToggleIcon) elements.youtubeToggleIcon.addEventListener('click', () => toggleYoutubeUI());
    if (elements.youtubeHideButton) elements.youtubeHideButton.addEventListener('click', () => toggleYoutubeUI(false));
    if (elements.youtubeSearchButton) elements.youtubeSearchButton.addEventListener('click', () => searchYoutube(elements.youtubeSearchInput.value));
    
    if (elements.youtubeSearchInput) {
        elements.youtubeSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchYoutube(elements.youtubeSearchInput.value);
        });
    }

    // Tampilkan peringatan API Key di awal (sama seperti gambar 97f51c.png)
    if (YOUTUBE_API_KEY === 'AIzaSyBXQ0vrsQPFnj9Dif2CM_ihZ5pBZDBDKjw') {
        alert("PERINGATAN: YouTube API Key Anda adalah kunci contoh dan TIDAK AKAN BERFUNGSI. Harap ganti dengan kunci yang valid.");
    }
    
    // 5. Mulai Mesin setelah 1 detik (Simulasi)
    setTimeout(() => {
        setEngine(true);
    }, 1000);
});

let elements = {};
let speedMode = 1; 
let engineState = false; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 
let vitalInterval = null; 
let isYoutubeOpen = false; 
let fuelWarningInterval = null; 
let currentFuelWarningType = null; 

// 🚨 BARU: Variabel untuk status Lampu Sen
let turnSignalState = 0; // 0=Off, 1=Left, 2=Right, 3=Hazard (Left+Right)

// Objek Audio Peringatan Bensin
const fuelWarningSound = new Audio('bensin.mp3'); 
const criticalFuelSound = new Audio('sekarat.mp3'); 

// *****************************************************************
// ⚠️ PENTING: API KEY YOUTUBE
// *****************************************************************
const YOUTUBE_API_KEY = 'AIzaSyCISE9aLaUpeaa_tEK-usE17o7rkpJl7Zs'; 
// *****************************************************************

// --- FUNGSI UTILITY & TOGGLE ---
const toggleActive = (element, state) => {
    if (Array.isArray(element)) {
        element.forEach(el => toggleActive(el, state));
        return;
    }
    if (element) {
        if (state) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }
};

// Fungsi untuk memainkan bensin.mp3 dua kali (ting ting)
function playLowFuelSoundTwice() {
    fuelWarningSound.currentTime = 0;
    fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3 (1).", e); });
    
    // Play the sound a second time after a very short pause (0.5 detik)
    setTimeout(() => {
        fuelWarningSound.currentTime = 0;
        fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3 (2).", e); });
    }, 500); 
}

// Fungsi untuk mengontrol dua tingkat peringatan suara (10% dan 4%)
function toggleFuelWarning(type) {
    if (currentFuelWarningType === type) {
        return; 
    }

    // 1. Bersihkan semua interval dan hentikan semua suara yang aktif
    if (fuelWarningInterval !== null) {
        clearInterval(fuelWarningInterval);
        fuelWarningInterval = null;
    }
    fuelWarningSound.pause();
    criticalFuelSound.pause();
    currentFuelWarningType = null;
    

    // 2. Tentukan status baru
    if (type === 'low') {
        // Status Rendah (10% - 5%): bensin.mp3 dua kali setiap 10 detik
        
        playLowFuelSoundTwice();
        
        fuelWarningInterval = setInterval(playLowFuelSoundTwice, 10000); // 10 detik
        
        currentFuelWarningType = 'low';

    } else if (type === 'critical') {
        // Status Kritis (Di bawah 4%): sekarat.mp3 setiap 5 detik
        
        criticalFuelSound.currentTime = 0; 
        criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3.", e); });
        
        fuelWarningInterval = setInterval(() => {
            criticalFuelSound.currentTime = 0;
            criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3 (interval).", e); });
        }, 5000); // 5 detik
        
        currentFuelWarningType = 'critical';
    }
}


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
    
    // Kecepatan selalu positif (simulasi hanya maju)
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
    const displayValue = `${Math.round(rpm * 10000)}`;
    if (elements.rpm) elements.rpm.innerText = displayValue;
}

function setFuel(fuel) {
    // Tampilkan nilai Fuel seperti biasa
    const displayValue = `${Math.round(fuel * 100)}%`;
    if (elements.fuel) elements.fuel.innerText = displayValue;

    // Logika Peringatan Bahan Bakar (10%-5% untuk bensin.mp3, <=4% untuk sekarat.mp3)
    if (fuel <= 0.04) { 
        toggleFuelWarning('critical');
    } else if (fuel <= 0.1) { 
        toggleFuelWarning('low');
    } else { 
        toggleFuelWarning(null); 
    }
}

function setHealth(health) {
    const displayValue = `${Math.round(health * 100)}%`;
    if (elements.health) elements.health.innerText = displayValue;
}

// 🚨 HAPUS setGear dan maxGearAchieved

function setHeadlights(state) {
    headlightsState = state;
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
            toggleFuelWarning(null); 
        }
    }
}

function setSeatbelts(state) {
    seatbeltState = state;
    toggleActive(elements.seatbeltIcon, state); 
}

// 🚨 BARU: Fungsi untuk mengontrol Lampu Sen
function setTurnSignal(state) {
    turnSignalState = state; 
    
    // Status Sen Kiri (1) atau Hazard (3)
    const isLeftOn = (state === 1 || state === 3); 
    // Status Sen Kanan (2) atau Hazard (3)
    const isRightOn = (state === 2 || state === 3); 
    
    toggleActive(elements.turnSignalLeft, isLeftOn);
    toggleActive(elements.turnSignalRight, isRightOn);

    // Hapus class 'N' dari gear display (jika gear div tetap digunakan untuk kosmetik)
    if(elements.gear) elements.gear.innerText = '';
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
}
// ---------------------------------------------------------------------

// --- FUNGSI KONTROL SIMULASI BERKENDARA (DIHENTIKAN SAAT MESIN MATI) ---

function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    
    setSpeed(0);
    setRPM(0.1); 
    // Hapus setGear
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    setRPM(0.1); 
    // Hapus setGear dan maxGearAchieved

    simulationInterval = setInterval(() => {
        // Logika pergerakan (HANYA MAJU)
        let speedChange = (Math.random() - 0.5) * 0.5;
        currentSpeed = currentSpeed + speedChange;

        // Pastikan kecepatan tidak negatif (tidak ada mundur)
        currentSpeed = Math.max(0, currentSpeed);
        
        // Fix Speed Stabil di 0
        if (currentSpeed < 0.5 && speedChange < 0) { 
            currentSpeed = 0; 
            speedChange = 0; 
        } 
        
        // Batasi kecepatan Maju max 40 m/s (~144 KMH)
        currentSpeed = Math.min(40, currentSpeed); 
        
        setSpeed(currentSpeed);
        
        // RPM Logic
        const absSpeed = Math.abs(currentSpeed);
        let baseRPM = absSpeed > 5 ? 0.4 : 0.1;
        const currentRPM = absSpeed > 0 ? Math.max(0.1, Math.min(0.9, baseRPM + (Math.random() - 0.5) * 0.05)) : 0.1;
        setRPM(currentRPM);
        
        // Logika Lampu Sen: Berkedip
        // Toggle active class setiap 500ms jika Lampu Sen diaktifkan
        if (turnSignalState !== 0) {
            elements.turnSignalLeft.classList.toggle('blink', turnSignalState === 1 || turnSignalState === 3);
            elements.turnSignalRight.classList.toggle('blink', turnSignalState === 2 || turnSignalState === 3);
        } else {
            elements.turnSignalLeft.classList.remove('blink');
            elements.turnSignalRight.classList.remove('blink');
        }
        
    }, 300); // Interval dipercepat menjadi 300ms untuk efek blinking yang halus
}


// --- FUNGSI KONTROL DATA VITAL (SELALU AKTIF) ---

function startVitalUpdates() {
    if (vitalInterval !== null) return;
    
    const initialFuel = 0.49;
    const initialHealth = 1.0;
    setHealth(initialHealth); 
    setFuel(initialFuel); 

    vitalInterval = setInterval(() => {
        const fuelReductionRate = engineState ? 0.005 : 0.001; 
        
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        const currentFuel = parseFloat(currentFuelText) / 100;
        
        // Batas aman minimum di set ke 0.01 (1%) agar bisa turun sampai 0%
        setFuel(Math.max(0.01, currentFuel - fuelReductionRate)); 
        
    }, 3000); 
}

// --- FUNGSI YOUTUBE API (TETAP SAMA) ---
async function searchYoutube(query) {
    if (!query || YOUTUBE_API_KEY === 'GANTI_DENGAN_API_KEY_ANDA_DI_SINI') {
        alert("Harap masukkan API Key YouTube Anda yang valid di dalam script.js!");
        return;
    }
    
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
    
    elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px; width: 300px;">Mencari...</p>';
    elements.youtubeResults.classList.remove('hidden');


    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        elements.youtubeResults.innerHTML = ''; 

        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnailUrl = item.snippet.thumbnails.default.url; 

                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result-item');
                resultItem.setAttribute('data-videoid', videoId);
                resultItem.innerHTML = `<img src="${thumbnailUrl}" alt="${title}"><p>${title}</p>`;
                
                resultItem.addEventListener('click', () => {
                    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    showVideo(embedUrl); 
                    elements.youtubeResults.classList.add('hidden'); 
                });

                elements.youtubeResults.appendChild(resultItem);
            });
            elements.youtubeResults.classList.remove('hidden');
            elements.youtubeResults.scrollLeft = 0;

        } else {
            elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px;">Tidak ditemukan video.</p>';
        }

    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        
        let errorMessage = 'Gagal terhubung ke API.';
        if (error.message.includes('403')) {
              errorMessage = 'API Key GAGAL. Cek apakah kunci Anda sudah valid atau kuota habis.';
        }
        
        elements.youtubeResults.innerHTML = `<p style="color:red; padding: 10px; width: 300px;">${errorMessage}</p>`;
    }
}

function showVideo(url) {
    if (elements.browserIframe) {
        elements.browserIframe.src = url; 
    }
}

function toggleYoutubeSearchUI(show) {
    if (elements.youtubeSearchUI) {
        elements.youtubeSearchUI.classList.toggle('hidden', !show);
    }
    if (elements.youtubeResults) {
        elements.youtubeResults.classList.toggle('hidden', !show);
    }
    if (!show && elements.youtubeResults) {
        elements.youtubeResults.innerHTML = '';
    }
}


// --- LOGIC TOGGLE YOUTUBE ---

function toggleYoutubeUI(state) {
    const speedometer = elements.speedometerUI;
    const youtubeWrapper = elements.youtubeUIWrapper;
    
    if (state === undefined) {
        state = !isYoutubeOpen;
    }

    isYoutubeOpen = state;
    
    if (state) {
        speedometer.classList.add('youtube-active');
        youtubeWrapper.classList.remove('hidden');
        toggleActive(elements.youtubeToggleIcon, true);
        
        toggleYoutubeSearchUI(true);
        if (elements.youtubeSearchInput) elements.youtubeSearchInput.focus();
        
    } else {
        speedometer.classList.remove('youtube-active');
        youtubeWrapper.classList.add('hidden');
        toggleActive(elements.youtubeToggleIcon, false);
        
        toggleYoutubeSearchUI(false);
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        speedometerUI: document.getElementById('speedometer-ui'), 
        youtubeUIWrapper: document.getElementById('youtube-ui-wrapper'), 
        
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        timeWIB: document.getElementById('time-wib'), 
        gear: document.getElementById('gear'), // Tetap dipakai untuk layout kosmetik
        speedMode: document.getElementById('speed-mode'),

        // Indikator
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'), 
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        youtubeToggleIcon: document.getElementById('youtube-toggle-icon'), 
        
        // 🚨 BARU: Indikator Sen
        turnSignalLeft: document.getElementById('turn-signal-left'),
        turnSignalRight: document.getElementById('turn-signal-right'),
        
        // Elemen YouTube Internal
        youtubeSearchUI: document.getElementById('youtube-search-ui'),
        youtubeSearchInput: document.getElementById('youtube-search-input'),
        youtubeSearchButton: document.getElementById('youtube-search-button'),
        youtubeResults: document.getElementById('youtube-results'),
        browserIframe: document.getElementById('browser-iframe'), 
        
        // Tombol Hide/Close YouTube
        youtubeHideButton: document.getElementById('youtube-hide-button'),
    };
    
    // 2. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 3. SETUP INTERAKSI KLIK YOUTUBE TOGGLE
    if (elements.youtubeToggleIcon) {
        elements.youtubeToggleIcon.addEventListener('click', () => {
            toggleYoutubeUI(); 
        });
    }
    
    // 4. Listener untuk Tombol HIDE/CLOSE
    if (elements.youtubeHideButton) {
        elements.youtubeHideButton.addEventListener('click', () => {
            toggleYoutubeUI(false); 
        });
    }

    // 5. LOGIC INTERAKSI PENCARIAN YOUTUBE
    const handleSearch = () => {
        const query = elements.youtubeSearchInput.value;
        if (query.trim() !== '') {
            searchYoutube(query.trim());
        }
    };
    
    if (elements.youtubeSearchButton) {
        elements.youtubeSearchButton.addEventListener('click', handleSearch);
    }
    
    if (elements.youtubeSearchInput) {
        elements.youtubeSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // LOGIC ESCAPE UNTUK MENUTUP YOUTUBE
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isYoutubeOpen) {
            toggleYoutubeUI(false);
        }
    });


    // 6. INISIASI DATA AWAL & LOGIC KLIK INDIKATOR
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); 
    
    setEngine(false); 
    setHeadlights(1);
    setSeatbelts(true);
    
    // 🚨 INISIASI Lampu Sen (Mati)
    setTurnSignal(0); 
    
    // Mulai pembaruan data vital segera!
    startVitalUpdates(); 

    // 7. EVENT KLIK BARU UNTUK LAMPU SEN DAN FUNGSI LAIN
    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState); 
        });
    }
    
    if (elements.headlightsIcon) {
        elements.headlightsIcon.addEventListener('click', () => {
            const newState = (headlightsState === 1) ? 0 : 1; 
            setHeadlights(newState);
        });
    }

    if (elements.seatbeltIcon) {
        elements.seatbeltIcon.addEventListener('click', () => {
            setSeatbelts(!seatbeltState);
        });
    }
    
    // 🚨 EVENT KLIK UNTUK LAMPU SEN (L, R, Hazard)
    if (elements.turnSignalLeft) {
        elements.turnSignalLeft.addEventListener('click', () => {
            // Urutan: OFF -> L -> R -> H -> OFF
            if (turnSignalState === 0) setTurnSignal(1); // OFF -> L
            else if (turnSignalState === 1) setTurnSignal(2); // L -> R
            else if (turnSignalState === 2) setTurnSignal(3); // R -> H
            else if (turnSignalState === 3) setTurnSignal(0); // H -> OFF
        });
    }
    
    if (elements.turnSignalRight) {
        elements.turnSignalRight.addEventListener('click', () => {
            // Urutan: OFF -> R -> L -> H -> OFF
            if (turnSignalState === 0) setTurnSignal(2); // OFF -> R
            else if (turnSignalState === 2) setTurnSignal(1); // R -> L
            else if (turnSignalState === 1) setTurnSignal(3); // L -> H
            else if (turnSignalState === 3) setTurnSignal(0); // H -> OFF
        });
    }

    // Nyalakan mesin setelah 2 detik untuk memulai startSimulation
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

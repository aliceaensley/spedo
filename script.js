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
let isVehicleIdle = false; 
let timeInterval = null; 
let currentSpeedometerMode = 'digital'; // 'digital' atau 'analog'

// ✅ AUDIO FILES (Pastikan file ada di direktori yang sama)
const fuelWarningSound = new Audio('bensin.mp3'); 
const criticalFuelSound = new Audio('sekarat.mp3'); 
const welcomeSound = new Audio('selebew.mp3'); 
const seatbeltSound = new Audio('ahh.mp3'); 

// *****************************************************************
// Kunci API YouTube FINAL
// *****************************************************************
const YOUTUBE_API_KEY = 'ANDA_HARUS_MENGGANTI_INI_DENGAN_KUNCI_API_ANDA_YANG_ASLI'; // <-- GANTI DENGAN KUNCI ANDA!
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

function playLowFuelSoundTwice() {
    fuelWarningSound.currentTime = 0;
    fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3 (1).", e); });
    
    setTimeout(() => {
        fuelWarningSound.currentTime = 0;
        fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3 (2).", e); });
    }, 500); 
}

function toggleFuelWarning(type) {
    if (currentFuelWarningType === type) {
        return; 
    }

    if (fuelWarningInterval !== null) {
        clearInterval(fuelWarningInterval);
        fuelWarningInterval = null;
    }
    fuelWarningSound.pause();
    criticalFuelSound.pause();
    currentFuelWarningType = null;
    
    if (type === 'low') {
        playLowFuelSoundTwice();
        fuelWarningInterval = setInterval(playLowFuelSoundTwice, 10000);
        currentFuelWarningType = 'low';

    } else if (type === 'critical') {
        criticalFuelSound.currentTime = 0; 
        criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3.", e); });
        fuelWarningInterval = setInterval(() => {
            criticalFuelSound.currentTime = 0;
            criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3 (interval).", e); });
        }, 5000); 
        currentFuelWarningType = 'critical';
    }
}

// --- FUNGSI BARU: TOGGLE ANALOG/DIGITAL ---
function toggleSpeedometerMode() {
    if (currentSpeedometerMode === 'digital') {
        currentSpeedometerMode = 'analog';
        elements.digitalSpeedView.classList.add('hidden');
        elements.analogSpeedView.classList.remove('hidden');
        toggleActive(elements.modeToggleIcon, true); // Aktifkan glow Biru
    } else {
        currentSpeedometerMode = 'digital';
        elements.digitalSpeedView.classList.remove('hidden');
        elements.analogSpeedView.classList.add('hidden');
        toggleActive(elements.modeToggleIcon, false); // Matikan glow Biru
    }
    // Tidak perlu memanggil setSpeed/setRPM secara eksplisit, karena interval simulasi akan segera memperbarui
}


// --- FUNGSI PEMBARUAN DATA SPEEDOMETER (MODIFIKASI) ---

function setSpeedMode(mode) {
    speedMode = mode;
    let unit = 'KMH';
    switch(mode)
    {
        case 1: unit = 'MPH'; break;
        case 2: unit = 'Knots'; break;
        default: unit = 'KMH';
    }
    // Update kedua mode
    if (elements.speedModeDigital) elements.speedModeDigital.innerText = unit;
    if (elements.speedModeAnalog) elements.speedModeAnalog.innerText = unit;
}

function setSpeed(speed) {
    let speedValue;
    const absSpeed = Math.abs(speed); 
    
    switch(speedMode)
    {
        // 1 m/s = 2.236936 mph | 1 m/s = 1.943844 knot | 1 m/s = 3.6 kmh
        case 1: speedValue = Math.round(absSpeed * 2.236936); break; 
        case 2: speedValue = Math.round(absSpeed * 1.943844); break; 
        default: speedValue = Math.round(absSpeed * 3.6); 
    }
    
    const displayValue = String(speedValue).padStart(3, '0');
    
    // 1. Pembaruan Tampilan Digital (tetap 3 digit)
    if (elements.speedDigital) elements.speedDigital.innerText = displayValue; 
    
    // 2. Pembaruan Tampilan Analog (angka di tengah)
    if (elements.speedAnalogText) elements.speedAnalogText.innerText = speedValue;
    
    // 3. Pembaruan Jarum Analog (BARU!)
    const MAX_ANALOG_UNIT = 200; // Asumsi max speed 200 unit (MPH/KMH)
    const START_ANGLE = -135;
    const TOTAL_ANGLE = 270; // 135 - (-135)
    
    const safeSpeed = Math.min(MAX_ANALOG_UNIT, speedValue);
    const percentage = safeSpeed / MAX_ANALOG_UNIT;
    const angle = START_ANGLE + (percentage * TOTAL_ANGLE);
    
    if (elements.analogNeedle) {
        // Transform jarum analog
        elements.analogNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
}

function setRPM(rpm) {
    // Diasumsikan RPM masuk sebagai nilai 0.0 - 1.0
    const safeRPM = Math.max(0.16, rpm); 
    
    // Konversi ke nilai 4 digit (misal: 0.16 -> 1600)
    const displayValue = `${Math.round(safeRPM * 10000)}`.padStart(4, '0'); 
    
    // 1. Pembaruan RPM Digital (di panel info grid)
    if (elements.rpm) elements.rpm.innerText = displayValue;
    
    // 2. Pembaruan RPM Bar Analog (di panel analog)
    // RPM 0.0 sampai 1.0 akan menjadi 0% sampai 100% lebar bar.
    const barWidth = Math.round(safeRPM * 100); 
    if (elements.rpmBarAnalog) {
        elements.rpmBarAnalog.style.width = `${barWidth}%`;
    }
}

function setFuel(fuel) {
    const displayValue = `${Math.round(fuel * 100)}%`;
    if (elements.fuel) elements.fuel.innerText = displayValue;

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
    // Logika Suara Seatbelt
    if (state === true && seatbeltState === false) {
        seatbeltSound.currentTime = 0;
        seatbeltSound.play().catch(e => { 
            console.warn("Gagal memutar ahh.mp3. Pastikan file ada di direktori yang sama.", e); 
        });
    }

    seatbeltState = state;
    toggleActive(elements.seatbeltIcon, state); 
}

function updateTimeWIB() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`; 
    
    if (elements.timeWIB) {
        elements.timeWIB.innerText = timeString;
    }
}

function startClock() {
    updateTimeWIB();
    if (timeInterval) {
        clearInterval(timeInterval);
    }
    timeInterval = setInterval(updateTimeWIB, 1000); 
}

// --- FUNGSI KONTROL SIMULASI BERKENDARA ---

const IDLE_RPM_VALUE = 0.16; // 1600 RPM
const IDLE_TOLERANCE_MS = 0.2; // Batas kecepatan di mana simulasi dianggap bergerak (m/s)

function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    setSpeed(0);
    // Atur RPM ke 0000 saat mesin dimatikan (hanya untuk tampilan digital info grid)
    if (elements.rpm) elements.rpm.innerText = '0000'; 
    if (elements.rpmBarAnalog) elements.rpmBarAnalog.style.width = '0%'; // RPM Bar Analog mati
    isVehicleIdle = false; 
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    
    let accelerationRate = 0.5; 
    let decelerationRate = 0.1; 

    // Set nilai awal idle (000 dan 1600)
    setSpeed(0);
    setRPM(IDLE_RPM_VALUE); 

    simulationInterval = setInterval(() => {
        
        let targetSpeedChange = 0;
        
        let action = Math.random();
        
        if (action < 0.5) { 
            targetSpeedChange = accelerationRate * Math.random(); 
        } else if (action < 0.8) { 
            targetSpeedChange = -decelerationRate * Math.random() * 2; 
        } else {
            targetSpeedChange = (Math.random() - 0.5) * 0.1;
        }

        // Terapkan perubahan kecepatan
        currentSpeed += targetSpeedChange;
        
        // Perlambatan alami (Drag)
        if (targetSpeedChange < 0.1 && currentSpeed > 0) {
            currentSpeed *= 0.98; 
        }

        // Jika kecepatan sangat rendah, paksa ke 0 (Idle)
        if (currentSpeed < IDLE_TOLERANCE_MS) { 
            currentSpeed = 0; 
        } 
        
        currentSpeed = Math.max(0, currentSpeed);
        
        // Cek status Idle
        isVehicleIdle = (currentSpeed === 0);
        
        if (isVehicleIdle) {
            // ✅ Kunci Nilai: Jika idle, Speed = 0, RPM = IDLE_RPM_VALUE (1600)
            setSpeed(0);
            setRPM(IDLE_RPM_VALUE); 
        } else {
            // ✅ Simulasi normal jika bergerak
            setSpeed(currentSpeed); 
            
            const absSpeed = Math.abs(currentSpeed);
            
            // Logika RPM (Proporsional dengan Speed, tapi dengan lantai IDLE_RPM)
            let baseRPM = IDLE_RPM_VALUE + (absSpeed * 0.007); 
            
            let currentRPM = Math.min(0.99, baseRPM);
            
            // Tambahkan sedikit noise hanya saat bergerak
            currentRPM += (Math.random() - 0.5) * 0.02; 
            
            setRPM(currentRPM);
        }
        
    }, 100); // Interval 100ms agar simulasi lebih mulus
}


// --- FUNGSI KONTROL DATA VITAL ---
function startVitalUpdates() {
    if (vitalInterval !== null) return;
    
    const initialFuel = 0.49;
    const initialHealth = 1.0;
    setHealth(initialHealth); 
    setFuel(initialFuel); 

    vitalInterval = setInterval(() => {
        const fuelReductionRate = engineState ? 0.005 : 0.000; 
        
        // Logika Fuel
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        const currentFuel = parseFloat(currentFuelText) / 100;
        
        setFuel(Math.max(0.00, currentFuel - fuelReductionRate)); 
        
    }, 10000); 
}


// --- FUNGSI YOUTUBE API (TETAP SAMA) ---
async function searchYoutube(query) {
    if (!query) {
        elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px; width: 300px;">Harap masukkan kata kunci.</p>';
        elements.youtubeResults.classList.remove('hidden');
        return;
    }
    
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
    
    elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px; width: 300px;">Mencari...</p>';
    elements.youtubeResults.classList.remove('hidden');


    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            // Log detail error dari YouTube API jika ada
            const errorData = await response.json().catch(() => ({}));
            console.error('YouTube API Response Error:', errorData);
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
        
        let errorMessage = 'Gagal melakukan pencarian YouTube. (Kemungkinan: API Key salah/kuota habis/batasan CORS).';
        
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
        
        // Kosongkan iframe saat disembunyikan untuk menghentikan pemutaran
        if (elements.browserIframe) elements.browserIframe.src = 'about:blank';
    }
}

/**
 * Fungsi untuk mengontrol durasi overlay berdasarkan audio.
 * @param {number} durationMs - Durasi audio dalam milidetik.
 */
function hideWelcomeOverlay(durationMs) {
    if (!elements.welcomeOverlay) return;

    const totalDisplayTime = durationMs; 
    const fadeOutDuration = 1000;

    // Mulai animasi fade-out tepat setelah durasi audio
    const fadeOutStartDelay = Math.max(0, totalDisplayTime - fadeOutDuration);

    setTimeout(() => {
        elements.welcomeOverlay.classList.add('fade-out');
        
        // Hapus elemen sepenuhnya setelah transisi fade-out selesai
        setTimeout(() => {
            elements.welcomeOverlay.style.display = 'none';
            document.body.style.overflow = ''; 
        }, fadeOutDuration);
        
    }, fadeOutStartDelay);
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        speedometerUI: document.getElementById('speedometer-ui'), 
        youtubeUIWrapper: document.getElementById('youtube-ui-wrapper'), 
        
        // Elemen Tampilan Digital
        speedDigital: document.getElementById('speed-digital'),
        speedModeDigital: document.getElementById('speed-mode-digital'),
        
        // Elemen Tampilan Analog
        speedAnalogText: document.getElementById('speed-analog-text'),
        speedModeAnalog: document.getElementById('speed-mode-analog'),
        analogNeedle: document.getElementById('analog-needle'),
        rpmBarAnalog: document.getElementById('rpm-bar-analog'),
        
        // Mode View Toggler
        digitalSpeedView: document.getElementById('digital-speed-view'),
        analogSpeedView: document.getElementById('analog-speed-view'),
        modeToggleIcon: document.getElementById('mode-toggle-icon'),
        
        // Elemen Info Grid (Tetap menggunakan ID lama)
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        timeWIB: document.getElementById('time-wib'), 
        
        // Elemen Indikator Status
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'), 
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        youtubeToggleIcon: document.getElementById('youtube-toggle-icon'), 
        
        // Elemen YouTube
        youtubeSearchUI: document.getElementById('youtube-search-ui'),
        youtubeSearchInput: document.getElementById('youtube-search-input'),
        youtubeSearchButton: document.getElementById('youtube-search-button'),
        youtubeResults: document.getElementById('youtube-results'),
        browserIframe: document.getElementById('browser-iframe'), 
        youtubeHideButton: document.getElementById('youtube-hide-button'),
        
        // Overlay
        welcomeOverlay: document.getElementById('welcome-overlay'),
    };
    
    // 2. Tampilkan dan sembunyikan Overlay Selamat Datang (Disinkronkan dengan Audio)
    if (elements.welcomeOverlay) {
        
        welcomeSound.onloadedmetadata = () => {
            const audioDurationMs = welcomeSound.duration * 1000; // Konversi ke milidetik
            
            welcomeSound.currentTime = 0;
            welcomeSound.play().catch(e => {
                console.warn("Gagal memutar selebew.mp3. Fallback durasi.", e);
                hideWelcomeOverlay(2500); 
            });
            
            hideWelcomeOverlay(audioDurationMs);
        };
        
        welcomeSound.onerror = () => {
             console.error("Gagal memuat file selebew.mp3. Menggunakan durasi default.");
             hideWelcomeOverlay(2500); 
        };
        
        if(welcomeSound.readyState >= 2) {
             welcomeSound.onloadedmetadata();
        }
    }


    // 3. SETUP CLOCK WIB
    startClock(); 
    
    // 4. SETUP INTERAKSI KLIK YOUTUBE TOGGLE
    if (elements.youtubeToggleIcon) {
        elements.youtubeToggleIcon.addEventListener('click', () => {
            toggleYoutubeUI(); 
        });
    }
    
    // 5. Listener untuk Tombol HIDE/CLOSE
    if (elements.youtubeHideButton) {
        elements.youtubeHideButton.addEventListener('click', () => {
            toggleYoutubeUI(false); 
        });
    }
    
    // 6. LOGIC INTERAKSI PENCARIAN YOUTUBE
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


    // 7. INISIASI DATA AWAL & LOGIC KLIK INDIKATOR
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); 
    
    setEngine(false); 
    setHeadlights(1);
    setSeatbelts(true);
    
    // Mulai pembaruan data vital segera!
    startVitalUpdates(); 

    // 8. EVENT KLIK FUNGSI LAIN
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

    // ** EVENT KLIK BARU: TOGGLE MODE **
    if (elements.modeToggleIcon) {
        elements.modeToggleIcon.addEventListener('click', toggleSpeedometerMode);
    }
    
    // Nyalakan mesin setelah 2 detik untuk memulai startSimulation
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

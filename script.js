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

// Objek Audio Peringatan Bensin
const fuelWarningSound = new Audio('bensin.mp3'); 
const criticalFuelSound = new Audio('sekarat.mp3'); 

// *****************************************************************
// ⚠️ PERBAIKAN: Kunci API YouTube Diperbarui dengan kunci baru Anda
// *****************************************************************
const YOUTUBE_API_KEY = 'AIzaSyBXQ0vrsQPFnj9Dif2CM_ihZ5pBZDBDKjw'; 
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
    const safeRPM = Math.max(0.2, rpm); 
    const displayValue = `${Math.round(safeRPM * 10000)}`;
    if (elements.rpm) elements.rpm.innerText = displayValue;
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
function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    setSpeed(0);
    setRPM(0.0);
    isVehicleIdle = false; 
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    const IDLE_RPM = 0.2; 
    const IDLE_TOLERANCE_MS = 0.2; 

    setRPM(IDLE_RPM); 

    simulationInterval = setInterval(() => {
        
        let speedChange = (Math.random() - 0.5) * 0.5;
        currentSpeed = currentSpeed + speedChange;

        if (currentSpeed < IDLE_TOLERANCE_MS && speedChange < 0) { 
            currentSpeed = 0; 
        } 
        
        currentSpeed = Math.max(0, currentSpeed);
        currentSpeed = Math.min(40, currentSpeed); 
        
        setSpeed(currentSpeed);
        isVehicleIdle = (currentSpeed === 0);
        
        let currentRPM;
        
        if (isVehicleIdle) {
            currentRPM = IDLE_RPM + (Math.random() - 0.5) * 0.002; 
        } else {
            const absSpeed = Math.abs(currentSpeed);
            let baseRPM = Math.min(0.8, absSpeed / 50 + IDLE_RPM); 
            currentRPM = Math.max(IDLE_RPM + 0.05, Math.min(0.9, baseRPM + (Math.random() - 0.5) * 0.05));
        }

        setRPM(currentRPM);
        
    }, 300); 
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
        
        // Logika Health dinonaktifkan

        // Logika Fuel
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        const currentFuel = parseFloat(currentFuelText) / 100;
        
        setFuel(Math.max(0.00, currentFuel - fuelReductionRate)); 
        
    }, 10000); 
}


// --- FUNGSI YOUTUBE API ---
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
        
        let errorMessage = 'Gagal melakukan pencarian YouTube. (Kemungkinan: API Key salah/kuota habis).';
        
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
        
        toggleYoutubeSearchUI(false);
        if (elements.browserIframe) elements.browserIframe.src = 'about:blank';
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        // Kontainer Utama
        speedometerUI: document.getElementById('speedometer-ui'), 
        youtubeUIWrapper: document.getElementById('youtube-ui-wrapper'), 
        
        // Data Utama
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        timeWIB: document.getElementById('time-wib'), 
        speedMode: document.getElementById('speed-mode'),

        // Indikator
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'), 
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        youtubeToggleIcon: document.getElementById('youtube-toggle-icon'), 
        
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
    startClock(); 
    
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
    
    // Mulai pembaruan data vital segera!
    startVitalUpdates(); 

    // 7. EVENT KLIK FUNGSI LAIN
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
    
    // Nyalakan mesin setelah 2 detik untuk memulai startSimulation
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

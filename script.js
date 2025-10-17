let elements = {};
let speedMode = 1; 
let engineState = false; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 
let isYoutubeOpen = false; 
let fuelWarningInterval = null; // BARU: Menampung ID interval untuk delay suara

// Objek Audio Peringatan Bensin (Gunakan nama file Anda yang sudah di-upload)
const fuelWarningSound = new Audio('bensin.mp3'); 
// Properti loop dihilangkan

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

// MODIFIKASI: Fungsi untuk mengontrol suara peringatan dengan delay 10 detik
function toggleFuelWarning(activate) {
    if (activate) {
        // Hanya aktifkan jika interval belum berjalan
        if (fuelWarningInterval === null) {
            
            // 1. Putar suara segera
            fuelWarningSound.currentTime = 0; 
            fuelWarningSound.play().catch(e => {
                console.warn("Gagal memutar suara peringatan.", e);
            });
            
            // 2. Set interval untuk memutar ulang setiap 10 detik
            fuelWarningInterval = setInterval(() => {
                fuelWarningSound.currentTime = 0;
                fuelWarningSound.play().catch(e => {
                    console.warn("Gagal memutar suara peringatan (interval).", e);
                });
            }, 10000); // 10000 ms = 10 detik
        }
    } else {
        // Matikan Peringatan
        if (fuelWarningInterval !== null) {
            clearInterval(fuelWarningInterval);
            fuelWarningInterval = null;
            fuelWarningSound.pause();
        }
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
    switch(speedMode)
    {
        case 1: speedValue = Math.round(speed * 2.236936); break; 
        case 2: speedValue = Math.round(speed * 1.943844); break; 
        default: speedValue = Math.round(speed * 3.6); 
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

    // 🚨 MODIFIKASI: Cek apakah Fuel <= 10% (0.1)
    if (fuel <= 0.1) {
        toggleFuelWarning(true);
    } else {
        toggleFuelWarning(false);
    }
}

function setHealth(health) {
    const displayValue = `${Math.round(health * 100)}%`;
    if (elements.health) elements.health.innerText = displayValue;
}

function setGear(gear) {
    let gearText = 'N';
    if (gear > 0) {
        gearText = String(gear);
    } else if (gear < 0) {
        gearText = 'R';
    }
    if (elements.gear) elements.gear.innerText = gearText;
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
            // PENTING: Jika mesin mati, hentikan juga suara peringatan bensin
            toggleFuelWarning(false);
        }
    }
}

function setSeatbelts(state) {
    seatbeltState = state;
    toggleActive(elements.seatbeltIcon, state); 
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

// --- FUNGSI KONTROL SIMULASI ---
function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    
    setSpeed(0);
    setRPM(0);
    setGear(0); 
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    setRPM(0.1); 
    setGear(0); 

    simulationInterval = setInterval(() => {
        currentSpeed = Math.min(25, currentSpeed + (Math.random() - 0.5) * 0.5); 
        currentSpeed = Math.max(0, currentSpeed); 
        setSpeed(currentSpeed);
        
        let baseRPM = currentSpeed > 5 ? 0.3 : 0.1;
        const currentRPM = Math.max(0.1, Math.min(0.9, baseRPM + (Math.random() - 0.5) * 0.05));
        setRPM(currentRPM);
        
        if (currentSpeed > 20) {
            setGear(3);
        } else if (currentSpeed > 10) {
            setGear(2);
        } else if (currentSpeed > 0) {
            setGear(1);
        } else {
            setGear(0); 
        }
        
        // Simulasikan pengurangan bahan bakar
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        setFuel(Math.max(0.05, currentFuelText / 100 - 0.005)); // Mengurangi bahan bakar
        // Note: Batas aman minimum set ke 5% agar tidak langsung habis
    }, 3000); 
}

// --- FUNGSI YOUTUBE API ---

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


// --- FUNGSI KONTROL VIDEO ---

function showVideo(url) {
    if (elements.browserIframe) {
        elements.browserIframe.src = url; 
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
        gear: document.getElementById('gear'),
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
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 3. SETUP INTERAKSI CLICK YOUTUBE TOGGLE
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
    setFuel(0.49); // Mulai dari 49%
    
    setEngine(false); 
    setHeadlights(1);
    setSeatbelts(true);

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

    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

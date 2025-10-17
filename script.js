let elements = {};
let speedMode = 1; 
let engineState = false; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 

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

// --- FUNGSI PEMBARUAN DATA SPEEDOMETER (TIDAK BERUBAH) ---
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
    const displayValue = `${Math.round(fuel * 100)}%`;
    if (elements.fuel) elements.fuel.innerText = displayValue;
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

// FUNGSI INI HANYA MENGATUR TAMPILAN, TIDAK ADA LOGIKA INTERAKSI
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
    
    if (elements.headunitTimeWIB) {
        elements.headunitTimeWIB.innerText = timeString;
    }
}
// ---------------------------------------------------------------------

// --- FUNGSI KONTROL SIMULASI (TIDAK BERUBAH) ---
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
        
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        setFuel(Math.max(0.1, currentFuelText / 100 - 0.005));

    }, 3000); 
}

// --- FUNGSI YOUTUBE API (TIDAK BERUBAH) ---

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
                    // Gunakan 'rel=0' agar tidak ada video terkait.
                    const embedUrl = `https://www.googleapis.com/youtube/embed/${videoId}?rel=0`;
                    showBrowser(embedUrl); 
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

// --- LOGIC: KONTROL TAMPILAN HEAD UNIT (TIDAK BERUBAH) ---

function showAppGrid() {
    if (elements.appGrid) elements.appGrid.classList.remove('hidden');
    if (elements.iframeView) elements.iframeView.classList.add('hidden');
    
    toggleYoutubeSearchUI(false); 

    // Kosongkan src iframe saat kembali ke app grid, kecuali jika video berada di background player
    if (elements.browserIframe && !elements.backgroundVideoPlayer.contains(elements.browserIframe)) {
        elements.browserIframe.src = 'about:blank'; 
    }
}

function showBrowser(url) {
    if (elements.appGrid) elements.appGrid.classList.add('hidden');
    if (elements.iframeView) elements.iframeView.classList.remove('hidden');
    
    const isYoutubeApp = url.includes('youtube') && url.includes('embed') === false;
    toggleYoutubeSearchUI(isYoutubeApp); 
    
    if (elements.browserIframe) elements.browserIframe.src = url; 
}


// --- FUNGSI HEAD UNIT (LOGIKA PERSISTENSI VIDEO) ---

function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footerTrigger = elements.headunitFooter;
    const iframe = elements.browserIframe;
    const backgroundPlayer = elements.backgroundVideoPlayer;
    
    if (!tablet || !iframe || !backgroundPlayer) return;

    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        // --- KONDISI: HEAD UNIT DIBUKA ---
        tablet.classList.remove('hidden');
        if (footerTrigger) footerTrigger.style.display = 'none'; 
        
        // 1. Cek apakah video sedang diputar di latar belakang
        if (backgroundPlayer.contains(iframe)) {
            // 2. Pindahkan iFrame kembali ke dalam iframeView
            elements.iframeView.appendChild(iframe);
            
            // 3. Tampilkan kembali tampilan iFrame/Browser
            if (elements.appGrid) elements.appGrid.classList.add('hidden');
            if (elements.iframeView) elements.iframeView.classList.remove('hidden');
            
            // Tampilkan Search UI
            if (iframe.src.includes('youtube')) {
                 toggleYoutubeSearchUI(true); 
                 elements.youtubeResults.classList.add('hidden'); 
            }
            
        } else {
            // Jika tidak ada video di latar belakang, tampilkan App Grid normal
            showAppGrid(); 
        }

        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
    } else {
        // --- KONDISI: HEAD UNIT DITUTUP ---
        
        // Cek apakah iFrame saat ini memuat URL embed YouTube
        const isYoutubeVideoPlaying = iframe.src.includes('youtube.com/embed');
        
        if (isYoutubeVideoPlaying) {
            // 1. Pindahkan iFrame ke pemutar latar belakang
            backgroundPlayer.appendChild(iframe);
            // 2. Tidak ada refresh iframe.src = iframe.src, agar video tidak mengulang.
        } 
        
        // Animasi penutupan
        tablet.classList.remove('active'); 
        
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            if (footerTrigger) footerTrigger.style.display = 'block'; 
            
            // Jika video diputar di latar belakang, JANGAN panggil showAppGrid
            if (!isYoutubeVideoPlaying) {
                 showAppGrid(); 
            }
        }, transitionDuration); 
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen 
    elements = {
        speedometerUI: document.getElementById('speedometer-ui'), 
        headunitFooter: document.getElementById('headunit-footer'), 
        tabletUI: document.getElementById('tablet-ui'),
        
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
        
        headunitTimeWIB: document.getElementById('headunit-time-wib'), 
        closeTablet: document.getElementById('close-tablet'),
        
        // Elemen Head Unit Internal
        appGrid: document.getElementById('app-grid'),
        iframeView: document.getElementById('iframe-view'),
        browserApp: document.getElementById('browser-app'),
        youtubeApp: document.getElementById('youtube-app'), 
        browserIframe: document.getElementById('browser-iframe'),
        backToApps: document.getElementById('back-to-apps'),
        
        // Elemen BARU untuk Background Playback
        backgroundVideoPlayer: document.getElementById('background-video-player'),
        
        // Elemen BARU untuk YouTube Search
        youtubeSearchUI: document.getElementById('youtube-search-ui'),
        youtubeSearchInput: document.getElementById('youtube-search-input'),
        youtubeSearchButton: document.getElementById('youtube-search-button'),
        youtubeResults: document.getElementById('youtube-results')
    };
    
    // 2. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 3. SETUP INTERAKSI CLICK (Head Unit & Close)
    if (elements.headunitFooter) {
        elements.headunitFooter.addEventListener('click', () => {
            toggleHeadUnit(true); 
        });
    }
    
    if (elements.closeTablet) {
        elements.closeTablet.addEventListener('click', () => {
            toggleHeadUnit(false); 
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.tabletUI && !elements.tabletUI.classList.contains('hidden')) {
            toggleHeadUnit(false);
        }
    });

    // 4. LOGIC KLIK APLIKASI
    
    if (elements.browserApp) {
        elements.browserApp.addEventListener('click', () => {
            toggleYoutubeSearchUI(false); 
            showBrowser('https://lsfd.jg-rp.com/index.php'); 
        });
    }
    
    if (elements.youtubeApp) {
        elements.youtubeApp.addEventListener('click', () => {
            if (elements.appGrid) elements.appGrid.classList.add('hidden');
            if (elements.iframeView) elements.iframeView.classList.remove('hidden');

            toggleYoutubeSearchUI(true); 
            
            elements.youtubeResults.innerHTML = '';
            elements.browserIframe.src = 'about:blank';
            
            if (elements.youtubeSearchInput) elements.youtubeSearchInput.focus();
        });
    }

    if (elements.backToApps) {
        elements.backToApps.addEventListener('click', () => {
            showAppGrid(); 
        });
    }
    
    // LOGIC INTERAKSI PENCARIAN YOUTUBE
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


    // 5. INISIASI DATA AWAL 
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); 
    
    // SET STATUS AWAL INDIKATOR (STATIS)
    setEngine(false); 
    setHeadlights(1); 
    setSeatbelts(true); 

    // HAPUS SEMUA EVENT LISTENERS UNTUK INDIKATOR (KECUALI ENGINE SIMULATION)
    // Headlights dan Seatbelt dibuat statis (tidak berfungsi)
    
    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState); 
        });
    }
    
    // Simulasikan mobil menyala setelah 2 detik
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});

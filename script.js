let elements = {};
let speedMode = 1; 
let engineState = true; // Mesin statis menyala di awal
let headlightsState = 1; // Lampu statis menyala di awal
let seatbeltState = true; // Seatbelt statis terpasang di awal
let simulationInterval = null; 
let activeMediaInHeadUnit = null; // Melacak apakah media (YouTube) aktif

// *****************************************************************
// ⚠️ PENTING: API KEY YOUTUBE
// *****************************************************************
const YOUTUBE_API_KEY = 'AIzaSyCISE9aLaUpeaa_tEK-usE17o7rkpJl7Zs'; 
// *****************************************************************

// --- FUNGSI UTILITY & TOGGLE (TIDAK BERUBAH) ---
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

// --- FUNGSI PEMBARUAN DATA SPEEDOMETER (STATIS) ---
// Speedometer akan menampilkan nilai awal dan tidak bergerak karena engine non-interaktif
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
    const speedValue = String(Math.round(speed * 3.6)).padStart(3, '0'); // Statis di 0 jika simulasi mati
    if (elements.speed) elements.speed.innerText = speedValue;
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
    let gearText = 'N'; // Gear statis di N
    if (elements.gear) elements.gear.innerText = gearText;
}

function setHeadlights(state) {
    headlightsState = state;
    toggleActive(elements.headlightsIcon, state > 0);
}

function setEngine(state) {
    engineState = state;
    toggleActive(elements.engineIcon, state);
    // SIMULASI TIDAK AKAN DIPANGGIL KARENA ENGINE NON-INTERAKTIF
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

// --- FUNGSI KONTROL SIMULASI (DINONAKTIFKAN TOTAL) ---
function stopSimulation() {
    // Dinonaktifkan
}

function startSimulation() {
    // Dinonaktifkan
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
                    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`; 
                    showBrowser(embedUrl, 'youtube'); 
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

// --- LOGIC: KONTROL TAMPILAN HEAD UNIT (Background Playback LOGIC) ---

function showAppGrid() {
    // *** Perubahan 1: Memindahkan iframe ke background saat BACK TO APPS ***
    
    if (elements.appGrid) elements.appGrid.classList.remove('hidden');
    if (elements.iframeView) elements.iframeView.classList.add('hidden');
    
    toggleYoutubeSearchUI(false); 

    const iframe = elements.browserIframe;
    const backgroundPlayer = elements.backgroundVideoPlayer;
    const isYoutubeVideoPlaying = iframe.src.includes('youtube.com/embed');

    if (isYoutubeVideoPlaying) {
         // Pindahkan iframe YouTube ke background player
        backgroundPlayer.appendChild(iframe);
        activeMediaInHeadUnit = 'youtube';
        
    } else if (elements.browserIframe && !backgroundPlayer.contains(iframe)) {
        // Jika bukan YouTube dan tidak ada di background, kosongkan (misal browser biasa)
        elements.browserIframe.src = 'about:blank'; 
        activeMediaInHeadUnit = null;
    }
    
    // Jika YouTube sudah ada di background, biarkan di sana (tidak dikosongkan)
}

function showBrowser(url, mediaType = 'browser') {
    if (elements.appGrid) elements.appGrid.classList.add('hidden');
    if (elements.iframeView) elements.iframeView.classList.remove('hidden');
    
    const iframe = elements.browserIframe;
    const backgroundPlayer = elements.backgroundVideoPlayer;

    if (backgroundPlayer.contains(iframe)) {
        // Pindahkan iframe dari background ke view untuk menimpa src-nya
        elements.iframeView.appendChild(iframe);
    }
    
    const isYoutubeApp = url.includes('youtube') && url.includes('embed') === false;
    toggleYoutubeSearchUI(isYoutubeApp); 
    
    if (elements.browserIframe) elements.browserIframe.src = url; 
    
    activeMediaInHeadUnit = mediaType === 'youtube' ? 'youtube' : null;
}


// --- FUNGSI HEAD UNIT (LOGIKA BACKGROUND PLAYBACK) ---

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
        if (activeMediaInHeadUnit === 'youtube' && backgroundPlayer.contains(iframe)) {
            // 2. Pindahkan iFrame kembali ke dalam iframeView
            elements.iframeView.appendChild(iframe);
            
            // 3. Tampilkan kembali tampilan iFrame/Browser
            if (elements.appGrid) elements.appGrid.classList.add('hidden');
            if (elements.iframeView) elements.iframeView.classList.remove('hidden');
            
            // Tampilkan Search UI (karena ini adalah YouTube)
            toggleYoutubeSearchUI(true); 
            elements.youtubeResults.classList.add('hidden'); 
            
        } else {
            // Jika tidak ada video di latar belakang, tampilkan App Grid normal
            showAppGrid(); 
        }

        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
    } else {
        // --- KONDISI: HEAD UNIT DITUTUP (BACKGROUND PLAYBACK) ---
        
        // Cek apakah iFrame saat ini memuat URL embed YouTube
        const isYoutubeVideoPlaying = iframe.src.includes('youtube.com/embed') || activeMediaInHeadUnit === 'youtube';
        
        if (isYoutubeVideoPlaying) {
            // 1. Pindahkan iFrame ke pemutar latar belakang
            if (elements.iframeView.contains(iframe)) {
                backgroundPlayer.appendChild(iframe);
            }
            activeMediaInHeadUnit = 'youtube'; // Set status media aktif
        } else {
            activeMediaInHeadUnit = null;
        }
        
        // Animasi penutupan
        tablet.classList.remove('active'); 
        
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            if (footerTrigger) footerTrigger.style.display = 'block'; 
            
        }, transitionDuration); 
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen (Sama)
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
            showBrowser('https://lsfd.jg-rp.com/index.php', 'browser'); 
        });
    }
    
    if (elements.youtubeApp) {
        elements.youtubeApp.addEventListener('click', () => {
            if (elements.appGrid) elements.appGrid.classList.add('hidden');
            if (elements.iframeView) elements.iframeView.classList.remove('hidden');

            toggleYoutubeSearchUI(true); 
            
            elements.youtubeResults.innerHTML = '';
            
            // Pindahkan/bersihkan iFrame jika bukan dari sesi YouTube background
            if (elements.browserIframe.src === 'about:blank' || elements.browserIframe.src === '') {
                 // Tidak perlu berbuat apa-apa, iframe sudah bersih/di view
            } else if (!elements.backgroundVideoPlayer.contains(elements.browserIframe)) {
                 // Jika ada content lain, kosongkan
                 elements.browserIframe.src = 'about:blank';
            }
            
            if (elements.youtubeSearchInput) elements.youtubeSearchInput.focus();
            activeMediaInHeadUnit = 'youtube'; // Set status YouTube
        });
    }

    if (elements.backToApps) {
        elements.backToApps.addEventListener('click', () => {
            showAppGrid(); // Akan memindahkan YouTube ke background
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


    // 5. INISIASI DATA AWAL (STATIS)
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); 
    setSpeed(0); // Kecepatan statis
    setRPM(0.1); // RPM statis
    setGear(-1); // Gear statis (misal: R)
    
    // SET STATUS AWAL INDIKATOR (STATIS)
    setEngine(true); 
    setHeadlights(1); 
    setSeatbelts(true); 

    // 6. TIDAK ADA EVENT LISTENER UNTUK INDIKATOR (STATIS)
    // Semua indikator (Lampu, Mesin, Seatbelt) statis.
});

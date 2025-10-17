let elements = {};
let speedMode = 1; 
let engineState = true; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 
let activeMediaInHeadUnit = null; 
let isYoutubeHidden = false; 

// *****************************************************************
// ⚠️ PENTING: GANTI DENGAN API KEY YOUTUBE ANDA YANG VALID
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

// --- FUNGSI PEMBARUAN DATA SPEEDOMETER (STATIS/AWAL) ---
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
    const speedValue = String(Math.round(speed * 3.6)).padStart(3, '0');
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
    let gearText = 'N'; 
    if (elements.gear) elements.gear.innerText = gearText;
}

function setHeadlights(state) {
    headlightsState = state;
    toggleActive(elements.headlightsIcon, state > 0);
}

function setEngine(state) {
    engineState = state;
    toggleActive(elements.engineIcon, state);
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
    
    if (elements.headunitTimeWIB) {
        elements.headunitTimeWIB.innerText = timeString;
    }
}
// ---------------------------------------------------------------------

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
    if (!query || YOUTUBE_API_KEY === 'AIzaSyCISE9aLaUpeaa_tEK-usE17o7rkpJl7Zs') {
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
                    // *** PERBAIKAN URL ABSOLUT DENGAN HTTPS:// ***
                    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&enablejsapi=1&modestbranding=1`; 
                    showBrowser(embedUrl, 'youtube'); 
                    elements.youtubeResults.classList.add('hidden'); 
                    
                    isYoutubeHidden = false; 
                    elements.speedometerYoutubeToggle.classList.add('hidden');
                    
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

// --- LOGIC: KONTROL TAMPILAN HEAD UNIT ---

function showAppGrid() {
    if (elements.appGrid) elements.appGrid.classList.remove('hidden');
    if (elements.iframeView) elements.iframeView.classList.add('hidden');
    
    toggleYoutubeSearchUI(false); 

    const iframe = elements.browserIframe;
    
    if (activeMediaInHeadUnit === 'youtube' && isYoutubeHidden) {
        // Biarkan iframe YouTube tetap di DOM
    } else {
         elements.speedometerYoutubeToggle.classList.add('hidden'); 
         iframe.src = 'about:blank'; 
         activeMediaInHeadUnit = null;
    }
}

function showBrowser(url, mediaType = 'browser') {
    if (elements.appGrid) elements.appGrid.classList.add('hidden');
    if (elements.iframeView) elements.iframeView.classList.remove('hidden');
    
    activeMediaInHeadUnit = mediaType === 'youtube' ? 'youtube' : null;

    const isYoutubeApp = url.includes('youtube') && url.includes('embed') === false;
    toggleYoutubeSearchUI(isYoutubeApp); 
    
    if (activeMediaInHeadUnit !== 'youtube' || !isYoutubeHidden) {
        if (elements.browserIframe) elements.browserIframe.src = url; 
    }
}

function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footerTrigger = elements.headunitFooter;
    const iframe = elements.browserIframe;
    
    if (!tablet || !iframe) return;

    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        // --- KONDISI: HEAD UNIT DIBUKA ---
        tablet.classList.remove('hidden');
        if (footerTrigger) footerTrigger.style.display = 'none'; 
        
        if (activeMediaInHeadUnit === 'youtube' && isYoutubeHidden) {
             // YouTube sedang hidden, tampilkan App Grid
             if (elements.appGrid) elements.appGrid.classList.remove('hidden');
             if (elements.iframeView) elements.iframeView.classList.add('hidden');
             
        } else if (iframe.src !== 'about:blank' && iframe.src !== '') {
             // Ada konten aktif (YouTube/Browser), tampilkan iframe view
             if (elements.appGrid) elements.appGrid.classList.add('hidden');
             if (elements.iframeView) elements.iframeView.classList.remove('hidden');
             
             if (activeMediaInHeadUnit === 'youtube') elements.speedometerYoutubeToggle.classList.add('hidden');
             
             isYoutubeHidden = false;
             
        } else {
            showAppGrid(); 
        }

        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
    } else {
        // --- KONDISI: HEAD UNIT DITUTUP (BACKGROUND PLAYBACK) ---
        
        if (activeMediaInHeadUnit === 'youtube') {
            if (!isYoutubeHidden) hideYoutubeToSpeedometer();
            
        } else if (iframe.src !== 'about:blank') {
            iframe.src = 'about:blank';
            elements.speedometerYoutubeToggle.classList.add('hidden');
            activeMediaInHeadUnit = null;
        } 
        
        tablet.classList.remove('active'); 
        
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            if (footerTrigger) footerTrigger.style.display = 'block'; 
            
        }, transitionDuration); 
    }
}

// --- FUNGSI HIDE/SHOW DARI HEAD UNIT ---

function hideYoutubeFromHeadUnit() {
    if (activeMediaInHeadUnit === 'youtube') {
        if (elements.iframeView) elements.iframeView.classList.add('hidden'); 
        if (elements.appGrid) elements.appGrid.classList.remove('hidden'); 
        
        elements.speedometerYoutubeToggle.classList.remove('hidden');
        elements.speedometerYoutubeToggle.innerText = 'SHOW YOUTUBE';
        
        isYoutubeHidden = true; 
    }
}

function hideYoutubeToSpeedometer() {
    if (activeMediaInHeadUnit === 'youtube') {
        if (elements.iframeView) elements.iframeView.classList.add('hidden');
        
        elements.speedometerYoutubeToggle.classList.remove('hidden');
        elements.speedometerYoutubeToggle.innerText = 'SHOW YOUTUBE';
        
        isYoutubeHidden = true; 
    }
}

// --- FUNGSI TOMBOL TOGGLE SPEEDOMETER ---
function toggleYoutubeFromSpeedometer() {
    if (activeMediaInHeadUnit === 'youtube') {
        // Tombol ini hanya muncul jika isYoutubeHidden adalah true
        toggleHeadUnit(true);
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
        
        // PENTING: timeWIB sekarang adalah tombol toggle
        speedometerYoutubeToggle: document.getElementById('time-wib'), 
        
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
        
        // Elemen BARU untuk YouTube Search
        youtubeSearchUI: document.getElementById('youtube-search-ui'),
        youtubeSearchInput: document.getElementById('youtube-search-input'),
        youtubeSearchButton: document.getElementById('youtube-search-button'),
        youtubeResults: document.getElementById('youtube-results'),
    };
    
    // 2. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 3. SETUP INTERAKSI CLICK
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
    
    // *** LISTENERS TOMBOL SPEEDOMETER ***
    if (elements.speedometerYoutubeToggle) {
         elements.speedometerYoutubeToggle.addEventListener('click', toggleYoutubeFromSpeedometer);
         elements.speedometerYoutubeToggle.classList.add('hidden'); 
    }

    // 4. LOGIC KLIK APLIKASI
    if (elements.browserApp) {
        elements.browserApp.addEventListener('click', () => {
            toggleYoutubeSearchUI(false); 
            showBrowser('https://lsfd.jg-rp.com/index.php', 'browser'); 
            elements.speedometerYoutubeToggle.classList.add('hidden');
        });
    }
    
    if (elements.youtubeApp) {
        elements.youtubeApp.addEventListener('click', () => {
            if (elements.appGrid) elements.appGrid.classList.add('hidden');
            if (elements.iframeView) elements.iframeView.classList.remove('hidden');

            toggleYoutubeSearchUI(true); 
            elements.youtubeResults.innerHTML = '';
            
            if (activeMediaInHeadUnit !== 'youtube' && elements.browserIframe.src !== 'about:blank') {
                 elements.browserIframe.src = 'about:blank';
            }
            
            if (elements.youtubeSearchInput) elements.youtubeSearchInput.focus();
            activeMediaInHeadUnit = 'youtube'; 
            isYoutubeHidden = false; 
            
            elements.speedometerYoutubeToggle.classList.add('hidden');
        });
    }

    if (elements.backToApps) {
        elements.backToApps.addEventListener('click', () => {
            if (activeMediaInHeadUnit === 'youtube') {
                 hideYoutubeFromHeadUnit(); 
            } else {
                 showAppGrid(); 
            }
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
    setSpeed(0); 
    setRPM(0.1); 
    setGear(-1); 
    
    setEngine(true); 
    setHeadlights(1); 
    setSeatbelts(true); 
    
    if (elements.speedometerYoutubeToggle) elements.speedometerYoutubeToggle.innerText = 'SHOW YOUTUBE';
});

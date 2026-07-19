export function initUI() {
    // Info Card Close Button
    const infoCard = document.getElementById('info-card');
    const closeBtn = document.getElementById('card-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            infoCard.classList.add('hidden');
        });
    }

    // Dock Items Interaction
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            dockItems.forEach(d => d.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Fullscreen Toggle
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }

    // Start Dynamic Stats
    setupDynamicStats();
}

function setupDynamicStats() {
    // 1. Live Time & Weather Updates (Qatar Time Zone: UTC+3)
    const timeEl = document.getElementById('local-time-val');
    const weatherEl = document.getElementById('weather-val');
    
    function updateTimeAndWeather() {
        if (!timeEl) return;
        const now = new Date();
        
        // Format time in Qatar timezone (UTC+3)
        const timeOptions = {
            timeZone: 'Asia/Qatar',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const timeFormatter = new Intl.DateTimeFormat([], timeOptions);
        timeEl.innerText = timeFormatter.format(now);
        
        // Extract hour in Qatar timezone to calculate realistic temperature
        const hourOptions = { timeZone: 'Asia/Qatar', hour: '2-digit', hour12: false };
        const hourFormatter = new Intl.DateTimeFormat([], hourOptions);
        const qatarHour = parseInt(hourFormatter.format(now));
        
        // Update weather based on the current Qatar local hour
        if (weatherEl) {
            let baseTemp = 32;
            if (qatarHour >= 12 && qatarHour <= 16) {
                baseTemp = 42; // Very hot midday
            } else if (qatarHour >= 6 && qatarHour <= 11) {
                baseTemp = 36; // Hot morning
            } else if (qatarHour >= 17 && qatarHour <= 21) {
                baseTemp = 34; // Warm evening
            } else {
                baseTemp = 30; // Cooler night
            }
            weatherEl.innerText = `${baseTemp}°C`;
        }
    }
    updateTimeAndWeather();
    setInterval(updateTimeAndWeather, 1000); // Check every second to keep clock ticking correctly

    // 2. Fluctuating Attendance (simulating live gate flow)
    const attEl = document.getElementById('attendance-val');
    let baseAttendance = 38450;
    
    function updateAttendance() {
        if (!attEl) return;
        // Randomly add/subtract people to simulate live gate traffic
        const fluctuation = Math.floor(Math.random() * 20) - 5; // Tendency to grow slightly
        baseAttendance += fluctuation;
        attEl.innerText = baseAttendance.toLocaleString();
    }
    setInterval(updateAttendance, 8000); // Every 8 seconds
}

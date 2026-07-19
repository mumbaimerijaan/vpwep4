// js/dashboard.js

export function initDashboard() {
    setupTabs();
    setupSparklines();
    setupTimeline();
    setupCopilotActions();
    
    // Listen for dashboard visibility toggle to run entrance animations
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isHidden = document.getElementById('dashboard-view').classList.contains('hidden');
                if (!isHidden) {
                    animateEntrance();
                }
            }
        });
    });
    
    const dashboardView = document.getElementById('dashboard-view');
    if (dashboardView) {
        observer.observe(dashboardView, { attributes: true });
    }
}

// 1. Setup Tab Clicking & Sliding Underline
function setupTabs() {
    const tabContainer = document.querySelector('.dashboard-tabs');
    const tabs = document.querySelectorAll('.tab-item');
    const underline = document.querySelector('.tab-underline');
    
    if (!tabContainer || !underline) return;
    
    function updateUnderline(activeTab) {
        const rect = activeTab.getBoundingClientRect();
        const containerRect = tabContainer.getBoundingClientRect();
        
        underline.style.left = `${rect.left - containerRect.left}px`;
        underline.style.width = `${rect.width}px`;
    }
    
    // Initialize underline position on first active tab
    const activeTab = tabContainer.querySelector('.tab-item.active');
    if (activeTab) {
        // Wait minor delay for render layout
        setTimeout(() => updateUnderline(activeTab), 100);
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateUnderline(tab);
            
            // Switch mock data if needed, or filter dashboard tabs view
            const selectedTab = tab.getAttribute('data-tab');
            console.log(`Switched dashboard tab context to: ${selectedTab}`);
        });
    });
    
    window.addEventListener('resize', () => {
        const currentActive = tabContainer.querySelector('.tab-item.active');
        if (currentActive) {
            updateUnderline(currentActive);
        }
    });
}

// 2. Generate and Render SVG Sparkline charts
function setupSparklines() {
    // Generate simple SVG path coordinates
    const chartsData = {
        'sparkline-attendance': [30, 35, 45, 60, 75, 78, 78],
        'sparkline-occupancy': [20, 25, 38, 48, 52, 52, 50],
        'sparkline-transport': [100, 250, 450, 800, 1150, 950, 800],
        'sparkline-wait': [15, 14, 12, 10, 8, 8, 7],
        'sparkline-alerts': [0, 1, 1, 2, 2, 2, 2],
        'sparkline-staff': [245, 245, 245, 245, 245, 245, 245],
        
        // Mini metrics cards sparklines
        'mini-sparkline-transport': [100, 200, 400, 600, 1150, 1000],
        'mini-sparkline-occupancy': [30, 45, 55, 60, 68, 65],
        'mini-sparkline-queue': [50, 80, 120, 180, 240, 200],
        'mini-sparkline-wait': [12, 10, 9, 8, 8, 7],
        'mini-sparkline-escalator': [40, 42, 42, 42, 42, 42],
        'mini-sparkline-medical': [0, 0, 1, 0, 0, 0]
    };
    
    Object.keys(chartsData).forEach(id => {
        const svg = document.getElementById(id);
        if (!svg) return;
        
        const data = chartsData[id];
        const width = parseFloat(svg.getAttribute('width') || 100);
        const height = parseFloat(svg.getAttribute('height') || 30);
        
        const minVal = Math.min(...data);
        const maxVal = Math.max(...data);
        const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;
        
        const points = data.map((val, idx) => {
            const x = (idx / (data.length - 1)) * width;
            const y = height - ((val - minVal) / range) * (height - 6) - 3; // Keep paddings top/bottom
            return `${x},${y}`;
        });
        
        const pathData = `M ${points.join(' L ')}`;
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.appendChild(path);
    });
}

// 3. Initialize Operations Timeline states
function setupTimeline() {
    const nodes = document.querySelectorAll('#timeline-scroll-container .timeline-node');
    // Active nodes on start up are the first 3
    nodes.forEach((node, idx) => {
        if (idx < 3) {
            node.classList.add('active');
            node.style.opacity = '1';
        }
    });
}

// 4. Copilot Recommendation Click handlers (Apply Actions Simulation)
function setupCopilotActions() {
    const btnApply = document.getElementById('btn-apply-rec');
    if (!btnApply) return;
    
    btnApply.addEventListener('click', () => {
        if (btnApply.disabled) return;
        
        btnApply.innerText = "Applying Recommendation...";
        btnApply.disabled = true;
        btnApply.style.opacity = '0.6';
        
        // Simulate progress application (1 second delay)
        setTimeout(() => {
            // 1. Update active alerts count KPI card
            const alertVal = document.getElementById('kpi-val-alerts');
            const alertStatus = document.getElementById('kpi-status-alerts');
            const alertIcon = document.getElementById('kpi-icon-alerts');
            if (alertVal) {
                alertVal.innerText = '1';
                alertVal.classList.remove('text-danger');
                alertVal.classList.add('text-warning');
            }
            if (alertStatus) {
                alertStatus.innerText = 'Moderate Inflow';
                alertStatus.classList.remove('text-danger');
                alertStatus.classList.add('text-warning');
            }
            if (alertIcon) {
                alertIcon.classList.remove('text-danger');
                alertIcon.classList.add('text-warning');
            }
            
            // 2. Animate and remove High Priority incident card
            const inc1 = document.getElementById('inc-1');
            if (inc1) {
                gsap.to(inc1, {
                    opacity: 0,
                    height: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    borderWidth: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    onComplete: () => inc1.remove()
                });
            }
            
            // 3. Update Gate A crowd density heatmap state to safe/moderate (Yellow)
            const blobGateA = document.getElementById('blob-gate-a');
            const statusGateA = document.getElementById('status-text-gate-a');
            const pillGateA = document.getElementById('pill-gate-a');
            if (blobGateA) {
                // Animate transition of color gradient from red to yellow
                blobGateA.className = 'heatmap-blob blob-yellow';
            }
            if (statusGateA) {
                statusGateA.innerText = 'MODERATE';
                statusGateA.classList.remove('text-danger');
                statusGateA.classList.add('text-warning');
            }
            
            // 4. Update AI Copilot Situation list text
            const sitGateA = document.getElementById('sit-gate-a');
            if (sitGateA) {
                sitGateA.innerText = "Crowd density near Gate A normalized (Recommendation Applied).";
                sitGateA.classList.remove('text-danger');
                sitGateA.classList.add('text-success');
            }
            
            // 5. Update timeline status nodes
            const nodes = document.querySelectorAll('#timeline-scroll-container .timeline-node');
            nodes.forEach((node, idx) => {
                if (idx >= 3) {
                    setTimeout(() => {
                        node.classList.add('active');
                        gsap.to(node, { opacity: 1, duration: 0.4 });
                    }, (idx - 3) * 600); // Stagger active triggers
                }
            });
            
            btnApply.innerText = "Recommendation Applied";
            btnApply.style.background = 'var(--accent-green) !important';
            btnApply.style.borderColor = 'var(--accent-green) !important';
            
            console.log("Copilot operations successfully executed!");
        }, 1200);
    });
}

// 5. Entrance GSAP Animation Sequence
function animateEntrance() {
    // Animate KPI cards fade up staggered
    const kpiCards = document.querySelectorAll('.kpi-card');
    gsap.fromTo(kpiCards, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'transform' }
    );
    
    // Animate middle layout columns
    const heatmap = document.querySelector('.stadium-heatmap-widget');
    const copilot = document.querySelector('.copilot-panel');
    if (heatmap) {
        gsap.fromTo(heatmap, 
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
        );
    }
    if (copilot) {
        gsap.fromTo(copilot, 
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
        );
    }
    
    // Animate lower section cards staggered
    const lowerCards = document.querySelectorAll('.lower-widget');
    gsap.fromTo(lowerCards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
    
    // Animate AI Copilot progress bar fills
    const fillImprovement = document.getElementById('progress-fill-improvement');
    const fillConfidence = document.getElementById('progress-fill-confidence');
    if (fillImprovement) fillImprovement.style.width = '18%';
    if (fillConfidence) fillConfidence.style.width = '86%';
}

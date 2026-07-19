// js/dashboard.js
import { CHARTS_DATA } from './constants.js';

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

// 1. Setup Left Sidebar Tab Clicking
function setupTabs() {
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const selectedTab = item.getAttribute('data-tab');
            console.log(`Switched dashboard sidebar tab context to: ${selectedTab}`);
            
            // Toggle panels visibility
            const panels = document.querySelectorAll('.db-panel');
            panels.forEach(p => p.classList.remove('active'));
            
            const activePanel = document.getElementById(`panel-${selectedTab}`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
}

// 2. Generate and Render SVG Sparkline charts
function setupSparklines() {
    const chartsData = CHARTS_DATA;
    
    Object.keys(chartsData).forEach(id => {
        const svg = document.getElementById(id);
        if (!svg) return;
        
        // Clear previous path if any
        svg.textContent = '';
        
        const data = chartsData[id];
        const width = parseFloat(svg.getAttribute('width') || 70);
        const height = parseFloat(svg.getAttribute('height') || 24);
        
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
    const nodes = document.querySelectorAll('#timeline-scroll-container .timeline-node-twin');
    // Active nodes on start up are the first 3
    nodes.forEach((node, idx) => {
        if (idx < 3) {
            node.classList.add('active');
            node.style.opacity = '1';
        } else {
            node.classList.remove('active');
            node.style.opacity = '0.4';
        }
    });
}

// 4. Copilot Recommendation Click handlers (Apply Actions Simulation)
function setupCopilotActions() {
    const btnApply = document.getElementById('btn-apply-rec');
    if (!btnApply) return;
    
    btnApply.addEventListener('click', () => {
        if (btnApply.disabled) return;
        
        const btnText = btnApply.querySelector('span');
        if (btnText) btnText.innerText = "Applying Recommendation...";
        btnApply.disabled = true;
        btnApply.style.opacity = '0.6';
        
        // Simulate progress application (1.2 second delay)
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
                alertIcon.classList.remove('icon-red');
                alertIcon.classList.add('icon-orange');
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
                blobGateA.className = 'heatmap-blob-twin blob-yellow-twin';
            }
            if (statusGateA) {
                statusGateA.innerText = 'Moderate';
            }
            if (pillGateA) {
                pillGateA.className = 'map-label-pill pill-yellow';
            }
            
            // 4. Update AI Copilot Situation text description
            const sitDesc = document.getElementById('sit-desc');
            if (sitDesc) {
                sitDesc.innerHTML = "Crowd density near Gate A normalized (Recommendation Applied).<br>Metro inflow managed successfully.<br>Overall venue remains operational.";
            }
            
            // 5. Update timeline status nodes
            const nodes = document.querySelectorAll('#timeline-scroll-container .timeline-node-twin');
            nodes.forEach((node, idx) => {
                if (idx >= 3) {
                    setTimeout(() => {
                        node.classList.add('active');
                        gsap.to(node, { opacity: 1, duration: 0.4 });
                    }, (idx - 3) * 600); // Stagger active triggers
                }
            });
            
            if (btnText) btnText.innerText = "Recommendation Applied";
            btnApply.style.background = 'var(--accent-green) !important';
            btnApply.style.boxShadow = '0 4px 12px rgba(52, 199, 89, 0.3)';
            
            console.log("Copilot operations successfully executed!");
        }, 1200);
    });
}

// 5. Entrance GSAP Animation Sequence
function animateEntrance() {
    // Animate KPI cards fade up staggered
    const kpiCards = document.querySelectorAll('.kpi-card-twin');
    gsap.fromTo(kpiCards, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'transform' }
    );
    
    // Animate left/right panels
    const sidebar = document.querySelector('.sidebar-nav');
    const incidents = document.querySelector('.current-incidents-card');
    const heatmap = document.querySelector('.db-panel-switcher');
    const timeline = document.querySelector('.live-timeline-card');
    const copilot = document.querySelector('.copilot-card');
    
    if (sidebar) {
        gsap.fromTo(sidebar, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
    }
    if (incidents) {
        gsap.fromTo(incidents, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' });
    }
    if (heatmap) {
        gsap.fromTo(heatmap, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    }
    if (timeline) {
        gsap.fromTo(timeline, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' });
    }
    if (copilot) {
        gsap.fromTo(copilot, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
    }
    
    // Animate AI Copilot progress bar fills
    const fillImprovement = document.getElementById('progress-fill-improvement');
    const fillConfidence = document.getElementById('progress-fill-confidence');
    if (fillImprovement) fillImprovement.style.width = '18%';
    if (fillConfidence) fillConfidence.style.width = '86%';
}

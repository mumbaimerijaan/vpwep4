// js/constants.js

export const HOTSPOT_DATA = [
    { 
        id: 'gate-a', 
        title: 'GATE A – MAIN ENTRANCE', 
        color: 'var(--accent-blue)', 
        status: 'OPERATIONAL', 
        statusColor: 'var(--accent-green)', 
        icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>', 
        stats: { occ: '78%', queue: 240, wait: 18, rec: 'Normal' }, 
        pos: [0, 25, -90] 
    },
    { 
        id: 'parking', 
        title: 'PARKING ZONE P1', 
        color: 'var(--accent-blue)', 
        status: 'CONGESTED', 
        statusColor: 'var(--accent-orange)', 
        icon: '<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path><path d="M9 8h4a2 2 0 0 1 0 4H9v4"></path>', 
        stats: { occ: '92%', queue: 412, wait: 32, rec: 'Divert' }, 
        pos: [120, 10, -80] 
    },
    { 
        id: 'vip', 
        title: 'VIP LOUNGE', 
        color: 'var(--accent-purple)', 
        status: 'SECURE', 
        statusColor: 'var(--accent-green)', 
        icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', 
        stats: { occ: '45%', queue: 12, wait: 2, rec: 'Clear' }, 
        pos: [140, 15, 30] 
    },
    { 
        id: 'fnb', 
        title: 'CONCOURSE F&B', 
        color: 'var(--accent-orange)', 
        status: 'BUSY', 
        statusColor: 'var(--accent-orange)', 
        icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>', 
        stats: { occ: '88%', queue: 156, wait: 24, rec: 'Manage' }, 
        pos: [90, 10, 130] 
    },
    { 
        id: 'security', 
        title: 'SECURITY CHECKPOINT', 
        color: 'var(--accent-red)', 
        status: 'CRITICAL', 
        statusColor: 'var(--accent-red)', 
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', 
        stats: { occ: '99%', queue: 890, wait: 45, rec: 'Deploy' }, 
        pos: [-60, 10, 110] 
    },
    { 
        id: 'fanzone', 
        title: 'FAN ZONE PLAZA', 
        color: 'var(--accent-green)', 
        status: 'ACTIVE', 
        statusColor: 'var(--accent-green)', 
        icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', 
        stats: { occ: '65%', queue: 45, wait: 5, rec: 'Normal' }, 
        pos: [-130, 10, 20] 
    },
    { 
        id: 'metro', 
        title: 'METRO STATION 1', 
        color: 'var(--accent-green)', 
        status: 'OPERATIONAL', 
        statusColor: 'var(--accent-green)', 
        icon: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><path d="M4 16c4 0 8-4 8-8"></path><path d="M12 20c0-4 4-8 8-8"></path>', 
        stats: { occ: '52%', queue: 120, wait: 8, rec: 'Normal' }, 
        pos: [-150, 10, -60] 
    }
];

export const CHARTS_DATA = {
    'sparkline-attendance': [30, 35, 45, 60, 75, 78, 78],
    'sparkline-occupancy': [20, 25, 38, 48, 52, 52, 50],
    'sparkline-transport': [100, 250, 450, 800, 1150, 950, 800],
    'sparkline-wait': [15, 14, 12, 10, 8, 8, 7],
    'sparkline-alerts': [0, 1, 1, 2, 2, 2, 2],
    'sparkline-staff': [245, 245, 245, 245, 245, 245, 245]
};

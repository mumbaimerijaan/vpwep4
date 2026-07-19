// js/notification-ui.js
import { notificationManager } from './notification-manager.js';

export function initNotificationUI() {
    const btnNotifications = document.getElementById('btn-notifications');
    const badge = document.getElementById('notifications-badge');
    
    if (!btnNotifications) return;

    // Create the Dropdown Panel dynamically
    const panel = document.createElement('div');
    panel.id = 'notifications-panel';
    panel.className = 'notifications-panel glass-panel hidden';
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-relevant', 'all');
    document.body.appendChild(panel);

    // Create the Modal Alert Dialog dynamically
    const modalContainer = document.createElement('div');
    modalContainer.id = 'notification-modal-container';
    modalContainer.className = 'notification-modal-container hidden';
    document.body.appendChild(modalContainer);

    // Function to update the Badge UI
    function updateBadge() {
        const count = notificationManager.getUnreadCount();
        if (badge) {
            badge.innerText = count;
            if (count === 0) {
                badge.style.opacity = '0';
                setTimeout(() => {
                    if (notificationManager.getUnreadCount() === 0) {
                        badge.style.display = 'none';
                    }
                }, 200);
            } else {
                badge.style.display = 'flex';
                badge.style.opacity = '1';
            }
        }
    }

    // Function to position the Dropdown Panel
    function positionPanel() {
        const rect = btnNotifications.getBoundingClientRect();
        panel.style.position = 'absolute';
        panel.style.top = `${rect.bottom + window.scrollY + 10}px`;
        
        // Centered directly below the bell, clamped to viewport bounds
        const panelWidth = 360;
        const screenWidth = window.innerWidth;
        const centerX = rect.left + rect.width / 2;
        const left = Math.max(16, Math.min(screenWidth - panelWidth - 16, centerX - panelWidth / 2));
        
        panel.style.left = `${left}px`;
        panel.style.width = `${panelWidth}px`;
    }

    // Render notifications inside the panel
    function renderList() {
        const list = notificationManager.getNotifications();
        if (list.length === 0) {
            panel.innerHTML = `<div class="notif-empty">No notifications</div>`;
            return;
        }

        panel.innerHTML = `
            <div class="notif-header">
                <h3>Notifications</h3>
                <span class="notif-mark-all" id="notif-mark-all">Mark all read</span>
            </div>
            <div class="notif-list">
                ${list.map(notif => {
                    const isUnread = !notif.read;
                    const priorityClass = `priority-${notif.priority}`;
                    const unreadClass = isUnread ? 'unread' : 'read';
                    return `
                        <div class="notif-item ${unreadClass}" data-id="${notif.id}">
                            <div class="notif-indicator-bar ${priorityClass}"></div>
                            <div class="notif-content">
                                <div class="notif-title-row">
                                    <span class="notif-title">${notif.title}</span>
                                    ${isUnread ? '<span class="notif-unread-dot"></span>' : ''}
                                </div>
                                <p class="notif-short">${notif.short}</p>
                                <span class="notif-time">${notif.time}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Bind clicks to items
        const items = panel.querySelectorAll('.notif-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.getAttribute('data-id'));
                handleNotificationClick(id);
            });
        });

        // Bind click to Mark All Read
        const markAll = panel.querySelector('#notif-mark-all');
        if (markAll) {
            markAll.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid closing dropdown immediately
                list.forEach(n => {
                    notificationManager.markAsRead(n.id);
                });
                renderList();
                updateBadge();
            });
        }
    }

    // Handle Notification Click: Mark Read -> Close Panel -> Open Modal
    function handleNotificationClick(id) {
        notificationManager.markAsRead(id);
        updateBadge();
        
        // Close the panel
        panel.classList.add('hidden');
        
        // Find notification full info
        const notif = notificationManager.getNotifications().find(n => n.id === id);
        if (notif) {
            openAlertDialog(notif);
        }
    }

    // Open Alert Dialog Modal
    function openAlertDialog(notif) {
        let priorityColor = '#007aff'; // default info
        let priorityIcon = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

        if (notif.priority === 'warning') {
            priorityColor = '#ff9500';
            priorityIcon = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else if (notif.priority === 'success') {
            priorityColor = '#34c759';
            priorityIcon = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        }

        modalContainer.innerHTML = `
            <div class="notification-modal glass-panel scale-up">
                <div class="modal-header" style="border-left: 4px solid ${priorityColor};">
                    <span class="modal-icon" style="color: ${priorityColor};">${priorityIcon}</span>
                    <div class="modal-title-area">
                        <h2>${notif.title}</h2>
                        <span class="modal-time">${notif.time}</span>
                    </div>
                </div>
                <div class="modal-body">
                    <p class="modal-full-text">${notif.full}</p>
                    <div class="modal-recommendation">
                        <strong>Recommendation:</strong>
                        <p>${notif.recommendation}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="glass-btn secondary-btn" id="modal-btn-dismiss">Dismiss</button>
                    <button class="glass-btn primary-btn" id="modal-btn-ack" style="background: ${priorityColor} !important; border-color: ${priorityColor} !important; color: #ffffff !important;">Acknowledge</button>
                </div>
            </div>
        `;

        modalContainer.classList.remove('hidden');

        // Bind modal dismiss buttons
        const closeBtn = () => {
            modalContainer.classList.add('hidden');
        };
        modalContainer.querySelector('#modal-btn-dismiss').addEventListener('click', closeBtn);
        modalContainer.querySelector('#modal-btn-ack').addEventListener('click', closeBtn);
        
        // Also close when clicking backdrop itself
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeBtn();
            }
        });
    }

    // Toggle Dropdown Panel
    btnNotifications.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (panel.classList.contains('hidden')) {
            positionPanel();
            renderList();
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    });

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== btnNotifications) {
            panel.classList.add('hidden');
        }
    });

    // Handle Window Resizing (repositions panel if open)
    window.addEventListener('resize', () => {
        if (!panel.classList.contains('hidden')) {
            positionPanel();
        }
    });

    // Initial load
    updateBadge();
}

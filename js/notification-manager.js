// js/notification-manager.js

class NotificationManager {
    constructor() {
        this.notifications = [
            {
                id: 1,
                priority: "warning",
                title: "Crowd Density Increasing",
                short: "Gate A crowd increasing rapidly.",
                full: "AI Crowd Intelligence has detected a 14% increase in pedestrian density near Gate A over the last 6 minutes. Predicted congestion in approximately 12 minutes.",
                recommendation: "Redirect arriving visitors to Gate B.",
                time: "2 minutes ago",
                read: false
            },
            {
                id: 2,
                priority: "info",
                title: "Metro Arrival",
                short: "Metro Line 2 arriving.",
                full: "Metro Line 2 is arriving in approximately 4 minutes. Estimated passenger inflow: 1,150 visitors.",
                recommendation: "Prepare Entry Gates A and C.",
                time: "5 minutes ago",
                read: false
            },
            {
                id: 3,
                priority: "success",
                title: "Queue Normalized",
                short: "Food Court queues normalized.",
                full: "Average waiting time at the Food Court has reduced from 12 minutes to 4 minutes. No further action required.",
                recommendation: "None (No further action required).",
                time: "9 minutes ago",
                read: false
            }
        ];
    }

    getNotifications() {
        return this.notifications;
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    markAsRead(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif && !notif.read) {
            notif.read = true;
            return true;
        }
        return false;
    }
}

export const notificationManager = new NotificationManager();

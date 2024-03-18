document.addEventListener('DOMContentLoaded', () => {
    const intervalInput = document.getElementById('interval');
    const setIntervalBtn = document.getElementById('setIntervalBtn');
    const stopBtn = document.getElementById('stopBtn');
    let notificationInterval = null; // Initialize to null

    // Load interval and nextNotificationTimestamp from localStorage
    let storedInterval = localStorage.getItem('reminderInterval');
    let nextNotificationTimestamp = localStorage.getItem('nextNotificationTimestamp');

    if (storedInterval) {
        intervalInput.value = storedInterval;
    }

    setIntervalBtn.addEventListener('click', () => {
        const intervalMinutes = parseInt(intervalInput.value);
        if (isNaN(intervalMinutes) || intervalMinutes <= 0) {
            alert('Please enter a valid interval (greater than 0).');
            return;
        }

        // Store the interval locally
        localStorage.setItem('reminderInterval', intervalMinutes);
        alert(`Reminder interval set to ${intervalMinutes} minutes.`);

        // Calculate next notification timestamp
        const currentTime = Date.now();
        nextNotificationTimestamp = currentTime + intervalMinutes * 60 * 1000;
        localStorage.setItem('nextNotificationTimestamp', nextNotificationTimestamp);

        // Clear previous interval, if any
        if (notificationInterval !== null) {
            clearInterval(notificationInterval);
        }
        // Schedule new interval
        notificationInterval = scheduleReminderNotification(intervalMinutes);
    });

    stopBtn.addEventListener('click', () => {
        console.log("stopped!", notificationInterval)
        if (notificationInterval != null) {
            clearInterval(notificationInterval);
            intervalInput.value = null;
            localStorage.setItem('reminderInterval', 0);
            localStorage.removeItem('nextNotificationTimestamp'); // Remove next notification timestamp
        }
    });

    // Check if a notification needs to be scheduled on page load
    if (nextNotificationTimestamp) {
        console.log('debug')
        const timeUntilNextNotification = nextNotificationTimestamp - Date.now();
        if (timeUntilNextNotification > 0) {
            notificationInterval = setTimeout(() => {
                console.log("Scheduled reminder notification triggered");
                showReminderNotification();
                localStorage.removeItem('nextNotificationTimestamp'); // Remove next notification timestamp after triggering
            }, timeUntilNextNotification);
        }
    }
});

function scheduleReminderNotification(intervalMinutes) {
    return setInterval(() => {
        console.log("Reminder notification triggered");
        showReminderNotification();
    }, intervalMinutes * 60 * 1000); // Convert minutes to milliseconds
}
function showReminderNotification() {
    if (Notification.permission == "granted") {
        registerAndShowNotification();
    } else if (Notification.permission != 'denied') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                // If permission is granted after requesting, create a new notification
                registerAndShowNotification();
            }
        });
    }
}

function registerAndShowNotification() {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            registration.showNotification('Reminder', {
                body: 'Time to blink!',
                icon: '/path/to/reminder-icon.png'
            });
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}
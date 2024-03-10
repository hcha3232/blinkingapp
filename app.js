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
        const interval = parseInt(intervalInput.value);
        if (isNaN(interval) || interval <= 0) {
            alert('Please enter a valid interval (greater than 0).');
            return;
        }

        // Store the interval locally
        localStorage.setItem('reminderInterval', interval);
        alert(`Reminder interval set to ${interval} seconds.`);

        // Calculate next notification timestamp
        const currentTime = Date.now();
        nextNotificationTimestamp = currentTime + interval * 1000;
        localStorage.setItem('nextNotificationTimestamp', nextNotificationTimestamp);

        // Clear previous interval, if any
        if (notificationInterval !== null) {
            clearInterval(notificationInterval);
        }
        // Schedule new interval
        notificationInterval = scheduleReminderNotification(interval);
    });

    stopBtn.addEventListener('click', ()=> {
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

function scheduleReminderNotification(interval) {
    return setInterval(() => {
        console.log("Reminder notification triggered");
        showReminderNotification();
    }, interval * 1000);
}

function showReminderNotification() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
    }

    // Check if the user has granted permission to show notifications
    if (Notification.permission === 'granted') {
        // Create and display the reminder notification
        const notification = new Notification('Blink Reminder', {
            body: 'Don\'t forget to blink!',
            // Provide the path to your notification icon
        });

        // Optionally, add event listeners to handle user interaction with the notification
        notification.onclick = () => {
            // Handle click on the notification (e.g., open the PWA)
            window.focus(); // Bring the browser window to focus
        };

        notification.onclose = () => {
            // Handle close of the notification
            console.log('Reminder notification closed');
        };

    } else if (Notification.permission !== 'denied') {
        // Request permission from the user to show notifications
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                // Permission granted, show the notification
                showReminderNotification();
            }
        });
    }
}

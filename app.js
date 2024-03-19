
    const intervalInput = document.getElementById('interval');
    const setIntervalBtn = document.getElementById('setIntervalBtn');
    const stopBtn = document.getElementById('stopBtn');
   

    // Load interval and nextNotificationTimestamp from localStorage
    let storedInterval = localStorage.getItem('reminderInterval');

    if (storedInterval) {
        intervalInput.value = storedInterval;
    }

    setIntervalBtn.addEventListener('click', () => {
        const intervalMinutes = parseInt(intervalInput.value);
        if (isNaN(intervalMinutes) || intervalMinutes <= 0) {
            alert('Please enter a valid interval (greater than 0).');
            return;
        }
        else if (Notification.permission == "granted") {
            localStorage.setItem('reminderInterval', intervalMinutes);
            scheduleReminderNotification(intervalMinutes);
            alert(`Reminder interval set to ${intervalMinutes} seconds.`);
        }
        else if (Notification.permission != 'denied') {
            alert('Please subscribe');
        }
    });


function scheduleReminderNotification(intervalMinutes) {
    return setInterval(() => {
        console.log("Reminder notification triggered");
        registerAndShowNotification();
    }, intervalMinutes * 1000); // Convert minutes to milliseconds
}


function registerAndShowNotification() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        navigator.serviceWorker.ready.then(registration => {
            // If service worker is already registered, schedule the reminder notification
            registration.showNotification('Blink!');
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    }
}
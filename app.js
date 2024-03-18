
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

        alert(`Reminder interval set to ${intervalMinutes} minutes.`);
        scheduleReminderNotification(intervalMinutes);
    });


function scheduleReminderNotification(intervalMinutes) {
    return setInterval(() => {
        console.log("Reminder notification triggered");
        showReminderNotification();
    }, intervalMinutes * 1000); // Convert minutes to milliseconds
}

function showReminderNotification() {
    if (Notification.permission == "granted") {
        registerAndShowNotification();
    } else if (Notification.permission != 'denied') {
        alert("Please subscribe")
    }
}

function registerAndShowNotification() {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            registration.showNotification('Blink!');
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
}
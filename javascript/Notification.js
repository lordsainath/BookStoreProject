export function giveNotification(message, type = 'success') {

    let container = document.getElementById('notification-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.classList.add(
        type === 'success' ? 'notification--success' : 'notification--error'
    );

    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement === container) {
            container.removeChild(notification);
        }

        if (container.children.length === 0) {
            container.remove();
        }
    }, 2500);
}
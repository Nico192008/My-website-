document.getElementById('messageForm').add ```javascript
EventListener('submit', async function (e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const response = await fetch('/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
    });

    const newMessage = await response.json();
    displayMessage(newMessage);
    document.getElementById('messageForm').reset();
});

async function loadMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    messages.forEach(displayMessage);
}

function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<strong>${message.name}</strong>: ${message.message}`;
    messagesDiv.appendChild(messageDiv);
}

// Load messages on page load
loadMessages();

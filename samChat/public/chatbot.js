document.addEventListener("DOMContentLoaded", function() {
        var scriptTag = document.querySelector('script[src*="chatbot.js"]');
        companyId = scriptTag.getAttribute('data-company-id');

    var chatboxHtml = `
        <div id="chatbox" style="width: 300px; height: 400px; border: 1px solid #ccc; padding: 10px; overflow-y: scroll;"></div>
        <input type="text" id="userInput" style="width: calc(100% - 22px);" placeholder="Type a message..." />
        <button onclick="sendMessage()">Send</button>
    `;
    var chatContainer = document.createElement('div');
    chatContainer.innerHTML = chatboxHtml;
    document.body.appendChild(chatContainer);

    window.sendMessage = function() {
        var userInput = document.getElementById('userInput').value;
        if (userInput.trim() === "") return;
        
        var chatbox = document.getElementById('chatbox');
        chatbox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById('userInput').value = '';

        fetch(`http://localhost:3000/chat?company=${companyId}`, { // Update with your server URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            chatbox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
            chatbox.scrollTop = chatbox.scrollHeight;
        });
    };
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(require('cors')())

app.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    const companyId = req.query.company;

    let botReply = '';

    // Company-specific logic
    switch (companyId) {
        case 'companyA':
            if (userMessage.toLowerCase().includes('hello')) {
                botReply = 'Hello from Company A! How can I assist you today?';
            } else {
                botReply = 'Company A bot here! Ask me anything.';
            }
            break;
        case 'companyB':
            if (userMessage.toLowerCase().includes('hello')) {
                botReply = 'Hello from Company B! How can I assist you today?';
            } else {
                botReply = 'Company B bot at your service! How can I help?';
            }
            break;
        default:
            botReply = 'I am a generic bot. Ask me anything!';
    }

    res.json({ reply: botReply });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

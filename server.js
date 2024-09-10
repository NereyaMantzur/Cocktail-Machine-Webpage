// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/make_drink', (req, res) => {
    const fetch = require('node-fetch');
    const { drink, quantity } = req.body;
    const esp32IP = 'http://192.168.1.178'; // Replace with your ESP32 IP address

    fetch(`${esp32IP}/make_drink`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ drink, quantity })
    })
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(500).send('Error communicating with ESP32'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

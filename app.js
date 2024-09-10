const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle control commands
app.post('/control', (req, res) => {
    const { action } = req.body;

    // Implement logic to communicate with ESP32 here
    // Example: console.log(action);

    res.send(`Action received: ${action}`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

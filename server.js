const express = require('express');
const handler = require('./api/index.js');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    await handler(req, res);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

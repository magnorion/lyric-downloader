
require('dotenv').config()
const express = require('express');

const app = express();
const LyricController = require('./src/controller/lyric.controller');

app.get('/download-lyric', async (req, res) => {
    const controller = new LyricController();
    const dtStart = new Date().toISOString();
    
    controller.getLyric();

    res.json({ message: "Lyrics download started", startTime: dtStart });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

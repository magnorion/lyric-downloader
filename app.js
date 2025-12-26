const LyricController = require('./src/controller/lyric.controller');

require('./src/controller/lyric.controller');
require('./src/service/lyric.service');
require('dotenv').config()

const controller = new LyricController();
controller.getLyric();

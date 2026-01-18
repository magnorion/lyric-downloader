/**
 * Script para execução direta do controlador de letras
 */

require('dotenv').config()

const LyricController = require('./src/controller/lyric.controller');

const controller = new LyricController();

controller.getLyric();
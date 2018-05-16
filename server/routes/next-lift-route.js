'use strict'

const { Router } = require('express');
const suggestedRoute = Router();
const { renderView } = require('../controllers/suggested-ctrl');

suggestedRoute.get('/next-lift', renderView);


module.exports = suggestedRoute;
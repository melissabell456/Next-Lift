'use strict'

const { Router } = require('express');
const suggestedRoute = Router();
const { renderView, renderSimilarLiftsView } = require('../controllers/suggested-ctrl');

suggestedRoute.get('/next-lift', renderView);
suggestedRoute.get('/view-similar', renderSimilarLiftsView);


module.exports = suggestedRoute;
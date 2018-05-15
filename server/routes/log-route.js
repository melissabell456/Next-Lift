'use strict'

const { Router } = require('express');
const logRoute = Router();
const { renderLiftForm, recordLift, renderSuggestedLiftForm, recordSuggestedLifts } = require('../controllers/log-ctrl');

logRoute.get('/log', renderLiftForm);
logRoute.post('/log', recordLift);
logRoute.get('/logSuggested', renderSuggestedLiftForm);

module.exports = logRoute;
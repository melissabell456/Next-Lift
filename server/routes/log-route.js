'use strict'

const { Router } = require('express');
const logRoute = Router();
const { renderLiftForm, recordLift, renderSuggestedLiftForm, parseSuggestedFormEntry } = require('../controllers/log-ctrl');

logRoute.get('/log', renderLiftForm);
logRoute.post('/log', recordLift);
logRoute.get('/logSuggested', renderSuggestedLiftForm);
logRoute.post('/logSuggested', parseSuggestedFormEntry);

module.exports = logRoute;
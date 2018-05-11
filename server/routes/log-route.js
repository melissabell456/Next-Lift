'use strict'

const { Router } = require('express');
const logRoute = Router();
const { renderLiftForm, recordLift } = require('../controllers/log-ctrl');

logRoute.get('/log', renderLiftForm);
logRoute.post('/log', recordLift);

module.exports = logRoute;
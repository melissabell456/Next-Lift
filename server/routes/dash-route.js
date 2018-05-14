'use strict'

const { Router } = require('express');
const dashRoute = Router();
const { renderDashView } = require('../controllers/dash-ctrl');

dashRoute.get('/dashboard', renderDashView);


module.exports = dashRoute;
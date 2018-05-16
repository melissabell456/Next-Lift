'use strict'

const { Router } = require('express');
const dashRoute = Router();
const { renderDashView, renderEditForm, updateUserEntry } = require('../controllers/dash-ctrl');

dashRoute.get('/dashboard', renderDashView);
dashRoute.get('/update-entry', renderEditForm);
dashRoute.post('/update-entry', updateUserEntry);


module.exports = dashRoute;
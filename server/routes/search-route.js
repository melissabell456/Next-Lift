'use strict'

const { Router } = require('express');
const searchRoute = Router();
const { getFilterType } = require('../controllers/search-ctrl');

// this route provides access points to search by name, filter by body region, body part, and motion of lift
searchRoute.get('/search', getFilterType);

module.exports = searchRoute;
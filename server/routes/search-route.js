'use strict'

const { Router } = require('express');
const searchRoute = Router();
const { searchLiftsTable } = require('../controllers/search-ctrl');

// this route provides access points to search by name, filter by body region, body part, or motion of lift
searchRoute.get('/search', searchLiftsTable);

module.exports = searchRoute;
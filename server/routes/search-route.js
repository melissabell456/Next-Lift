'use strict'

const { Router } = require('express');
const searchRoute = Router();
const { searchLiftsTable, renderSearchView } = require('../controllers/search-ctrl');

// this route provides access points to search by name, filter by body region, body part, or motion of lift
searchRoute.get('/explore', renderSearchView);
searchRoute.get('/search', searchLiftsTable);

module.exports = searchRoute;
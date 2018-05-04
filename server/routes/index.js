'use strict';

const { Router } = require('express');
const router = Router();
// const checkAuth = require('./checkAuth');

// TODO: when auth is set up, uncomment this and add anything requiring authentication below this middleware
// router.use(checkAuth);
router.get('/', function(req, res, next){
  res.render('index');
});

router.use(require('./search-route'));

module.exports = router;
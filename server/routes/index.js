'use strict';

const { Router } = require('express');
const router = Router();
// const checkAuth = require('./checkAuth');

router.get('/', function(req, res, next){
  res.render('index');
});

module.exports = router;
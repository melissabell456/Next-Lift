'use strict';

const { Router } = require('express');
const router = Router();
const checkAuth = require('./checkAuth');

router.get('/', function(req, res, next){
  req.user ? res.render('index') : res.render('auth');
});
router.use(require('./auth-route'));

// any routes below this will require authentication, if the user is not authenticated, they will be redirected to the home page 
router.use(checkAuth);

router.use(require('./search-route'));
router.use(require('./log-route'));

module.exports = router;
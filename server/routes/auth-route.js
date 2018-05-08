'use strict';

const { Router } = require('express');
const authRouter = Router();
const { login, register } = require('../controllers/authCtrl');

authRouter.post('/login', login);

module.exports = authRouter;
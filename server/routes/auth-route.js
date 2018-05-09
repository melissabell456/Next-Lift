'use strict';

const { Router } = require('express');
const authRouter = Router();
const { login, register, displayRegister } = require('../controllers/authCtrl');

authRouter.post('/login', login);
authRouter.get('/register', displayRegister);
authRouter.post('/register', register);

module.exports = authRouter;
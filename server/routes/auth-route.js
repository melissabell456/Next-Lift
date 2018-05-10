'use strict';

const { Router } = require('express');
const authRouter = Router();
const { login, register, displayRegister, logout } = require('../controllers/authCtrl');

authRouter.post('/login', login);
authRouter.get('/register', displayRegister);
authRouter.post('/register', register);
authRouter.post('/logout', logout);

module.exports = authRouter;
'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');

//the below sets the models as a property on the req, requiring these into middleware instead of modules will prevent multiple connections to the database at a time
app.set('models', require('./models/'));

//authentication
const session = require('express-session');
const passport = require('passport');
// require("./server/config/passport-strat.js");

// middleware
// app.use(passport.initialize());
// app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(routes);

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
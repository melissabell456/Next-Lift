'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/');
const flash = require('express-flash'); //TODO: what is this again and do I actually need it

//the below sets the models as a property on the req, requiring these into middleware instead of modules will prevent multiple connections to the database at a time
app.set('models', require('./models/'));

// middleware for css files
app.use(express.static(__dirname + '/static'));
// TODO: ASK JOE WAT? setting views as a property on res and also view engine? later referencing res.render('viewname')
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

//authentication
const session = require('express-session');
const passport = require('passport');
// require("./config/passport-strat.js");

// middleware
// Injects session persistence into middleware stack
app.use(session({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
// This custom middleware adds the logged-in user's info to the 'locals' variable,
// so we can access it in the Pug templates
app.use( (req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

//TODO: add error handler for all

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
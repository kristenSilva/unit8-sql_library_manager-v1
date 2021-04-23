var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Import instance of sequelize from models/index.js
const { sequelize } = require("./models");

//get routes
const routes = require('./routes/index');
const books = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use routes
app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 handler');
  const err = new Error();
  err.status = 404;
  err.message = 'Oops! Looks like the page you are looking for does not exist.'
  res.render('page-not-found', { err });
});

// global error handler
app.use(function(err, req, res, next) {
  console.log('global handler');

  if(err.status === 404){
    res.status(404);
    console.log(`Status: ${err.status}`);
    console.log(`Msg: ${err.message}`);
    res.render('page-not-found', { err });
  } else {
    err.message = err.message || 'Oops! Looks like something went wrong on the server';
    res.status(err.status || 500);
    console.log(`Status: ${err.status}`);
    console.log(`Msg: ${err.message}`);
    // render the error page
    res.render('error', { err });
  }
});

//test connection to database & sync model
(async () => {
  try {
      //authenticate used to test connection to data base
      await sequelize.authenticate ();
      console.log('Connection to database successful!');
  } catch (error) {
      console.error('Error connecting to database: ', error);
  }
})();

module.exports = app;

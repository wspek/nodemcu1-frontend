var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var dashboardRouter = require('./routes/dashboard');
var infoRouter = require('./routes/info')


var app = express();

// Set up database connection


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Coloco capa middleware para servir archivos estáticos con express.static()
//app.use('/public', express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
/* However, the path that you provide to the express.static function is relative 
 * to the directory from where you launch your node process. If you run the express 
 * app from another directory, it’s safer to use the absolute path of the directory 
 * that you want to serve:
 *     app.use('/static', express.static(path.join(__dirname, 'public')));
 */


// Rutas
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/dashboard', dashboardRouter);
app.use('/info', infoRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose= require("mongoose");
require("./models/userModel");
require("./models/categoryModel");
require("./models/productModels");
require("./models/sinhvienModels");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var SinhvienRouter = require('./routes/Sinhvien');
const { get } = require('http');
const router = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//http://localhost:3000/message
//connect database
mongoose.connect('mongodb+srv://danhnpcps40014:lnfNfqW1ede7g44a@cluster0.hbp08.mongodb.net/MD19302')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/Sinhvien', SinhvienRouter);

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

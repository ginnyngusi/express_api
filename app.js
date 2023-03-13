const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const db = require('mongoose').connection;
const dotenv = require('dotenv');

const indexRouter = require('./routes/index');
const customersRouter = require('./routes/customers');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

const app = express();
dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/customers', customersRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).then(() => console.log('DB Connected!'));
db.on('error', (err) => {
  console.log('DB connection error:', err.message);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.send("Not found");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.MODE === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

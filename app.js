const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
//const expressLayouts = require('express-layouts');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const playRouter = require('./routes/play');
const profileRouter = require('./routes/profile');
const leaderboardRouter = require('./routes/leaderboard');

const connectDB = require('./db');
const gameSocket = require('./socket/onlineGame');
const { isAuth, isLoggedIn } = require('./middleware/auth');

const port = process.env.PORT || 3000;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('layout', 'layouts/layout');

//app.use(expressLayouts);
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', isLoggedIn, indexRouter);
app.use('/user', isLoggedIn, userRouter);
app.use('/play', isAuth, playRouter);
app.use('/profile', isAuth, profileRouter)
app.use('/leaderboard', isLoggedIn, leaderboardRouter);

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
  res.render('error', { title: 'Error' });
});

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`.magenta)
});

connectDB();
gameSocket(server);

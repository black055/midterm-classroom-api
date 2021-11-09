const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRouter = require('./components/auth/index');
const userRouter = require('./components/user/user.route');
const courseRouter = require('./components/course/course.route');
const assignmentRouter = require('./components/assignment/assignment.route');

mongoose.connect('mongodb+srv://black055:strongpassword@classroomapp.1efhx.mongodb.net/classroom?retryWrites=true&w=majority', function (err) {
    if (err) throw err;
    console.log('Connect to database successful!');
  }, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/assignment", assignmentRouter);

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
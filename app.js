//**************module reference*********************************
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var FileStreamRotator = require('file-stream-rotator');
var logDirectory= path.join(__dirname,'logs');
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);
var accessLogStream=FileStreamRotator.getStream({date_format: 'YYYYMMDD',
    filename:path.join(logDirectory,'accss-%DATE%.log'),
    frequency:'daily',
    verbose:false
})
var errorLogStream=FileStreamRotator.getStream({date_format: 'YYYYMMDD',
    filename:path.join(logDirectory,'error-%DATE%.log'),
    frequency:'daily',
    verbose:false
})

var session= require("express-session");
var MongoStore = require('connect-mongo')(session);
var Settings = require('./Settings');
var index = require('./routes/index');
var users = require('./routes/users');
var reg = require("./routes/reg");
var login = require('./routes/login');
var logout = require('./routes/logout');
var post = require('./routes/post');


var app = express();
//********** view engine setup ***********************************
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('env', 'production');

//**********  mount  middleware
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined',{stream: accessLogStream}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//added by guof 20170-08-06
app.use(session({ secret:Settings.cookieSecret,resave: false,saveUninitialized: true,store:new MongoStore({  url: 'mongodb://localhost/guof' })}));

//**********************routine setting*****************************
// all route execute
app.use(function(req, res, next) {
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;
    res.locals.user = req.session.user;
    next();
});

app.use('/', index);
app.use('/users', users);
app.use("/reg",reg);
app.use("/login",login);
app.use("/logout",logout);
app.use("/post",post);
app.use("/u/:user",users);


//**** catch 404 and forward to error handler************************
app.use(function(req, res, next) {  
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
 	res.locals.message = err.message;
 	res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page  
	res.status(err.status || 500);
 
	var meta = '[' + new Date() + '] ' + req.url + '\n';
	errorLogStream.write(meta + err.stack + '\n');	
 	res.render('error');
});

//******************************* module return object ******************
module.exports = app;

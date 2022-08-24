var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan')
var helmet = require('helmet')

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.disable('x-powered-by');
app.use(helmet.hidePoweredBy());

app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());

app.use(
  helmet.frameguard({
    action: "deny",
  })
 );

app.use(
  helmet.dnsPrefetchControl({
    allow: true,
  })
 );

app.use(helmet.contentSecurityPolicy({
    //useDefaults: true,
    directives:
    {
      'script-src-attr': null,
      defaultSrc: ["'self'","http: 'unsafe-inline'"],
      imgSrc:["'self'","data:"],
      scriptSrc: ["'self'","http: 'unsafe-inline'"],
      objectSrc: ["'none'"],
      childSrc: ["'self'","https://www.google.com"],
      styleSrc:["'self'","https://cdn.jsdelivr.net","http: 'unsafe-inline'"],
      fontSrc:["'self'","http: 'unsafe-inline'"],
      formAction: ["'self'"],
      baseUri:["'none'"],
      upgradeInsecureRequests: [],
      frameAncestors: ["'none'"]
    },
    reportOnly: false,
  }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/');
  next()
});

app.listen(3000);

module.exports = app;

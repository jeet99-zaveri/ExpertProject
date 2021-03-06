/* ********** DEPENDENCIES ********** */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('req-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config/database');
const favicon = require('serve-favicon');

/* ********** INITIALIZE EXPRESS APP ********** */
const app = express();

/* ********** IMPORT ROUTES ********** */
const postsRoutes = require('./routes/posts.route');
const userRoutes = require('./routes/user.route');
const commentRoutes = require('./routes/comment.route');
const likeRoutes = require('./routes/like.route');


/* ********** MONGOOSE ********** */
let dev_db_url = config.database;
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, '\n\n *** MongoDB connection error:'));


app.use(bodyParser.urlencoded({
  extended: true
}));

// accept json 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'Demo',
  resave: true,
  saveUninitialized: true

}));
app.use(flash());
app.use("/public", express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));// app.use(express.static(__dirname + '/public/'));
app.use('*/images', express.static(path.join(__dirname, 'public/images')));
app.use('*/js', express.static(path.join(__dirname, 'public/js')));
app.use('*/css', express.static(path.join(__dirname, 'public/css')));


/* ********** APP SET ********** */
app.set('views', path.join(__dirname, '/views/'));
app.engine('.hbs', expressHandlebars({
  extname: '.hbs',
  // defaultLayout: 'mainLayout',
  layoutsDir: __dirname + '/views/layouts',
  helpers: {
    ifEqualsString: (arg1, arg2, options) => {
      return (String(arg1) == String(arg2)) ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('view engine', '.hbs');


/* ********** PASSPORT ********** */
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.loggedInUser = req.user || null;
  if (req.user != null) {
    console.log(req.user.usertype);
    if (req.user.usertype == "admin") {
      res.locals.admin = 1;
    }
    else if (req.user.usertype == "Faculty") {
      res.locals.faculty = 1;
    }
    else if (req.user.usertype == "Expert") {
      res.locals.expert = 1;
    }
    else if (req.user.usertype == "Student") {
      res.locals.student = 1;
    }
  }
  next();
});

app.post('*', (req, res, next) => {
  res.locals.loggedInUser = req.user || null;
  next();
});

app.use("/", postsRoutes);
app.use('/', userRoutes);
app.use('/', commentRoutes);
app.use('/', likeRoutes);

/* ********** SERVER START ********** */
let portNumber = process.env.PORT || 3000;
app.listen(portNumber, () => {
  console.log("*** Server is running on port: " + portNumber);
});
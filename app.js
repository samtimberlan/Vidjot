const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");

const app = express();

//Load routes
const ideas = require('./routes/ideas');

//Load routes
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
}).then(()=>{console.log('MongoDB Connected...')})
.catch(err => console.log(err));


//Handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Method Override Middleware (For PUT requests)
app.use(methodOverride('_method'));

// Express session Middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'big secret',
  resave: true,
  saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
  app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('successMsg');
  res.locals.error_msg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", { title: title });
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);
app.use(express.static(__dirname + '../public'));

//Server Connection
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

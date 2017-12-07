const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect("mongodb://localhost/vidjot-dev", {
  useMongoClient: true
}).then(()=>{console.log('MongoDB Connected...')})
.catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

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

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", { title: title });
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideasProperty: ideas
      });
    })
});

//GET - Add Idea Form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

//POST - Process Form
app.post('/ideas', (req, res)=>{
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title:req.body.title,
      details:req.body.details
    });
  } else{
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});

//Edit Idea Form
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    })
  })
});

//PUT - Edit Form Process
app.put('/ideas/:id', (req,res)=>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      })
  })
  ;
});


//DELETE - Delete Idea
app.delete('/ideas/:id', (req, res)=> {
  Idea.remove({
    _id:req.params.id})
    .then(()=> {
      res.redirect('/ideas');
    });
});

//Server Connection
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

const mongoose = require('mongoose');
const schema = mongoose.schema;

//Create Schema
const IdeaSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

mongoose.model('ideas', IdeaSchema);
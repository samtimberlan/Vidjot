if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI : 'mongodb://samtimberlan:anijun3em@ds251217.mlab.com:51217/tim-todo-prod'
  }
}
else{
  module.exports = {
    mongoURI : 'mongodb://localhost/vidjot-dev'
  }
}
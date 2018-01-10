const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
const UserModel = mongoose.model('users');

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'
}, (email, password, done) => {
    //Match user
    UserModel.findOne({
      email: email
    }).then(user => {
      if (!user){
        return done(null, false, {message: 'Please register before logging in.'});
      }

      //Match password 
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else{
          return done(null, false, {message: 'Password incorrect'});
        }
      })
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
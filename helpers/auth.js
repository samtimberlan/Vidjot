module.exports = {
  ensureAuthenticated : function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      req.flash('errorMsg', 'Please login or register');
      res.redirect('/users/login');
    }
  }
}
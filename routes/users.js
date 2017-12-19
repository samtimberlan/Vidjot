const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//const passport = require('passport');

//Load User model
require("../models/User");
const User = mongoose.model("users");

//User Login Route
router.get("/login", (req, res) => {
  res.render("users/login");
});

//User Register Route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//Register Form POST
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password.length < 5) {
    errors.push({ text: "Password must be at least 5 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("errorMsg", "Email already registered");
        res.redirect("register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "successMsg",
                  "You are now registered and can now log in"
                );
                res.redirect("login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

module.exports = router;

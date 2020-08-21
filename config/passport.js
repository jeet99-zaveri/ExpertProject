const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  passport.use(new LocalStrategy((email, password, done) => {

    // Match EmailID
    let query = {
      email: email
    };

    UserModel.findOne(query, (error, user) => {
      if(error){
        throw error;
      }

      if(!user){
        return done(null, false, {
          message: 'No User Found'
        });
      }

      // Match Password
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if(error){
          throw error;
        }

        if(isMatch){
          return done(null, user);
        }else{
          return done(null, false, {
            message: 'Wrong Password'
          });
        }
      })
    });

  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (error, user) => {
      done(error, user);
    });
  });
}
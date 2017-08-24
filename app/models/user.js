var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('../config').mongoose;
var userSchema = require('../config').userSchema;



userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
   bcrypt.hash(this.password, null, null, function(err, hash) {
    if(err) {
      console.log(err);

    } else {
      console.log('HASH', hash);
      this.password = hash;
      console.log('new password: ' + this.password);
    }
  });


  // var cipher = Promise.promisify(bcrypt.hash);
  // console.log('password', this.password);
  // return cipher(this.password, null, null).bind(this)
  //   .then(function(hash) {
  //     this.password = hash;
  //     console.log('HASH', hash)
  //   });
}

userSchema.pre('save', function(next){
  // this.hashPassword();
  userSchema.methods.hashPassword();
  next();

});

//console.log(userSchema.methods.hashPassword);

var User = mongoose.model('User', userSchema);


// var Harsh = new User({username: 'Harsh'});

// Harsh.save(function(error){
//   if(error) {
//     console.log(error);
//   }
// });


module.exports = User;

/*
var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function() {
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
});
*/
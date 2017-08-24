var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config').mongoose;
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, data) {
    if(err) {
      console.log(err);
      res.send(404);
    } else {
      res.send(200, data);
    }
  });

  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.find({url: uri}, function(err, link) {
    if(err) {
      console.log(err);
      res.send(404);
    } else {
      if (link.url && link.url.length > 0) {
        res.send(200, link);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.sendStatus(404);
          }
          var newLink = new Link({
            url: uri,
            base_url: req.headers.origin,
            title: title
          });
          newLink.save(function(error, newLink){
            if (error) {
              console.log(error);
              res.send(404);

            } else {
              res.send(200, newLink);
            }
          });
        });
      }
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.sendStatus(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.status(200).send(newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username:username}, function(error, user){
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  bcrypt.hash(password, null, null, function(err, hash) {
    if(err) {
      console.log(err);
    } else {
      password = hash;
        User.findOne({username:username}, function(error, user){
          if (error) {
            console.log(error);
            res.send(404);
          }
          if (!user) {
            var newUser = new User({username: username, password: password});
            newUser.save(function(error, newUser){
              if (error) {
                console.log(error);
                res.send(404)
              } else {
                util.createSession(req, res, newUser);
              }
            });
          } else {
            console.log('Account already exists');
            res.redirect('/signup');
        }
      });
    }
  });





  // new User({ username: username })
  //   .findOne()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(error, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link) {
        if(err) {
          console.log(err);
          res.send(404);
        } else {
          console.log(link.url);
          res.redirect(link.url);
        }
      });
    }
  });
};
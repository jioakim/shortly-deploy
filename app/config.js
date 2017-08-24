var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://harshioannis:123@ds155473.mlab.com:55473/shortlydeploy');

mongoose.connection.once('open', function() {
  console.log('database is connected');
});

mongoose.connection.on('error', function(error) {
  console.log('database connection error: ' + error);
});


var urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 }
});

var userSchema = new Schema({
  username: String,
  password: String
});

//var User = mongoose.model('User', userSchema);

// var Harsh = new User({username: 'Harsh', password: 'Harsh'});

// Harsh.save(function(error){
//   if(error) {
//     console.log(error);
//   }
// });

//var Url = mongoose.model('Url', urlSchema);

// var google = new Url({
//   url: 'www.google.com',
//   base_url: 'www.google.com',
//   code: 'wwww.google.com',
//   title: 'google',
//   visits: 4
//   });

// google.save(function(error){
//   if(error) {
//     console.log(error);
//   }
// });


module.exports.urlSchema = urlSchema;
module.exports.userSchema = userSchema;
module.exports.mongoose = mongoose;




// This was the SQL database provided - Harsh

// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });
var app = require('./server-config.js');

var port = 4568;

app.listen(port);

process.env.PRODUCTION = true;

console.log('Server now listening on port ' + port);
//harsh and ioannis were here

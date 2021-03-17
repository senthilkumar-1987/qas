const express = require('express');
CronJob = require('cron').CronJob;
const cronSchedulerContoller = require('./CronScheduler/CronSchedulerContoller');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var http = require('http');

var privateKey = fs.readFileSync('./SIRIMSSLCERT/wildcard.sirim.my.key', 'utf8');
var certificate = fs.readFileSync('./SIRIMSSLCERT/wildcard.sirim.my.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8080);
httpsServer.listen(443);

app.use(cors())
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '100mb', extended: true}))

// process.env.NODE_ENV = 'production';
{/* <link rel="icon" type="image/png" href="/favico.ico" /> */ }

//Routing Files
require('./routes/CommanServerRoutes')(app);
require('./routes/ReportsMgtRoutes/SCISRoutes')(app);

// var port = process.env.PORT || 8091;
// var server = app.listen(port, function () {
//   console.log('Server is running on port ' + port);
// });


// var httpsOptions = {
//   key: fs.readFileSync('./SIRIMSSLCERT/wildcard.sirim.my.key'),
//   cert: fs.readFileSync('./SIRIMSSLCERT/wildcard.sirim.my.pem')
// };

// https.createServer(httpsOptions, function (req, res) {
//   res.writeHead(200);
//   res.end("hello world\n");
// }).listen(port);

app.use(function (req, res, next) {
  // res.writeHead(200);
  res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "*"); console.log("token" + req.headers['authorization']);
  next();
});




//BAD DEBTS
//Every Day tow clock Onces ==> [0 0 2 */1 * *]
new CronJob('00 27 01 */1 * *', function () {
  // var date = new Date();
  console.log("staring cron " + new Date());

  cronSchedulerContoller.BadDebtScheduler(new Date());
}, null, true);

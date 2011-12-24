var express = require('express'),
    LurkerCtl = require('./lurkerctl').LurkerCtl;

var lurker = new LurkerCtl(
  "node", ["main.js"],          // Command line
  {cwd: "ips-lurker"},          // Working dir
  "ips-lurker/lurkerlog"        // Output file
);
var app = express.createServer();

app.use(express.logger());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static("public"));

var last_time = 0;
function now(){ return new Date().getTime(); }

app.get('/', function(req,res) {
          res.sendfile('public/index.htm');
});

app.get('/activate', function(req, res) {
          if ((now() - last_time) < 5) { res.send("Too fast"); return; }
          lurker.activate();
          res.send("ok");
          last_time = now();
        });
app.get('/deactivate', function(req, res) {
          if ((now() - last_time) < 5) { res.send("Too fast"); return; }
          lurker.deactivate();
          res.send("ok");
          last_time = now();
        });
app.get('/status', function(req, res) {
          res.send({isRunning: lurker.isRunning()});
        });

app.listen(8004);

process.on('SIGINT', function () {
             console.log("Dying in 6s...");
             lurker.deactivate();
             setTimeout(process.exit, 6000);
           });
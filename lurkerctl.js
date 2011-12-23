// Lurker control
var spawn = require('child_process').spawn,
    fs = require('fs');

function LurkerCtl(cmd,args,options, logfilename) {
  this.cmd=cmd;
  this.args = args;
  this.options = options;
  this.logfilename = logfilename;
  this.process = null;
}

LurkerCtl.prototype.isRunning = function(){
  return (this.process !== null);
}

LurkerCtl.prototype.deactivate = function(){
  if (!this.isRunning()) { return; }
  this.process.stdin.end();
  var nonce_key = this.nonce_key = Math.random();
  var self = this;
  setTimeout(function(){
               // Did someone else deactivate me?
               if (self.nonce_key != nonce_key) { return; }
               // Process is unresponsive.
               if (self.process !== null) {
                 console.log("Lurker's process is unresponsive, killing forcefully...");
                 self.process.kill('SIGKILL'); // :o!
               }
             }, 1000);
};

LurkerCtl.prototype.activate = function(){
  if (this.isRunning()) { return; }
  this.process = spawn(this.cmd, this.args, this.options);
  var self=this;
  console.log("Lurker starting");

  var outputStream = fs.createWriteStream(this.logfilename,
                                          {flags: 'a'});
  this.process.stdout.pipe(outputStream);
  this.process.stderr.pipe(outputStream);

  this.process.on('exit', function(code, signal) {
                    console.log("Lurker quit");
                    self.process = null;
                    outputStream.end();
                  });

}

exports.LurkerCtl = LurkerCtl;
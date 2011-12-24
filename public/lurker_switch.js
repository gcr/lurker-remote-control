
function getLurkerStatus(cb) {
  $.getJSON("/status", function(result) {
              cb(result.isRunning);
            });
}

function activateLurker(cb) {
  $.get("/activate");
}
function deactivateLurker(cb) {
  $.get("/deactivate");
}

function pollStatusEvery(time, cb) {
  getLurkerStatus(cb);
  setInterval(function() {
                getLurkerStatus(cb);
              }, time);
}

$(document).ready(function(){
                    var current_status = null;
                    $(".activate").click(activateLurker);
                    $(".deactivate").click(deactivateLurker);
                    pollStatusEvery(1000,
                      function(status) {
                        if (status !== current_status) {
                          // Switch!
                          $(".status_display")
                            .removeClass("activated deactivated")
                            .addClass(status? "activated" : "deactivated");
                          console.log(status);
                        }
                        current_status = status;
                      });
                  });

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
                    $(".activate").click(activateLurker);
                    $(".deactivate").click(deactivateLurker);
                    pollStatusEvery(
                      1000,
                      function(status) {
                        $("#status_display")
                          .text(status?"Lurker is ON":"Lurker is OFF");
                      });
                    // getLurkerStatus(function(result) {
                    //                   alert(result);
                    //                 });
                  });
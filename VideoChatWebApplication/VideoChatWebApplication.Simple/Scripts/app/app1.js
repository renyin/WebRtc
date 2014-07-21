
var videoHub = null;
var _stream = null;
var img = new Image();
var canvas = document.getElementById('c');
var canvas2 = document.getElementById('c2');
var context = canvas.getContext('2d');
var context2 = canvas2.getContext('2d');
var tryingToReconnect = false;

var setCanvasSize = function () {
    context.fillStyle = "rgb(38, 38, 38)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.height = canvas.height;
    context.width = canvas.width;

    context2.fillStyle = "rgb(38, 38, 38)";
    context2.fillRect(0, 0, canvas2.width, canvas2.height);
    context2.height = canvas2.height;
    context2.width = canvas2.width;
    //attachToCanvas(getCurrentVideo().getPlayer());
};


var attachToCanvas = function (player) {

    setCanvasSize();

    player.addEventListener('play', function () {
        var $this = this; //cache        
        (function loop() {
            if (!$this.paused && !$this.ended) {                
                context.drawImage($this, 0, 0, canvas.width, canvas.height);                
                setTimeout(function () {
                    if (!tryingToReconnect) {
                        videoHub.server.receive(canvas.toDataURL());
                    }                    
                    loop();                    
                },66);
            } else {
                if ($this.paused) {
                    context.drawImage($this, 0, 0, canvas.width, canvas.height);
                }
            }
        })();
        
    }, 0);

};


var startSharingMyVideo = function () {
    getUserMedia(
           {
               video: true
           },
           function (stream) {
               var videoElement = document.querySelector('#myVideo');
               _stream = stream;

               attachToCanvas(videoElement);

               attachMediaStream(videoElement, _stream);
           },
           function (error) {
               console.log('<h4>Failed to get hardware access!</h4> Do you have another browser type open and using your cam/mic?<br/><br/>You were not connected to the server, because I didn\'t code to make browsers without media access work well. <br/><br/>Actual Error: ' + JSON.stringify(error));
           }
       );
};


$(function () {
    videoHub = $.connection.webRtcHub;
    videoHub.client.receive = function (data) {                
        console.log(data);
        img.src = data;
        context2.drawImage(img, 0, 0);
        
    };

    // Start the connection.
    $.connection.hub.start().done(function () {
        startSharingMyVideo();
    });

    $.connection.hub.reconnecting(function () {
        tryingToReconnect = true;
    });

    $.connection.hub.reconnected(function () {
        tryingToReconnect = false;
    });

    $.connection.hub.disconnected(function () {
        if ($.connection.hub.lastError)
            { console.log("Disconnected. Reason: " + $.connection.hub.lastError.message); }

        setTimeout(function () {
            console.log('disconnected');
            $.connection.hub.start();
        }, 1000);
    });
});

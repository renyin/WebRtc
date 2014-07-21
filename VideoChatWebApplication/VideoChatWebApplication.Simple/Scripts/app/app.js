
var videoHub = null;
var img = new Image();
var canvas = document.getElementById('c');
var canvas2 = document.getElementById('c2');
var context = canvas.getContext('2d');
var context2 = canvas2.getContext('2d');
var player = document.getElementById('v');
var tryingToReconnect = false;


var  setCanvasSize = function () {
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


attachToCanvas(player);


$(function () {
    videoHub = $.connection.webRtcHub;
    videoHub.client.receive = function (data) {
        console.log(data);
        img.src = data;
        context2.drawImage(img, 0, 0);
    };

    // Start the connection.
    $.connection.hub.start().done(function () {        
            
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

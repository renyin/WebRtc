using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace VideoChatWebApplication.Simple.Hubs
{
    public class WebRtcHub : Hub
    {
        public void Receive(object data)
        {
            Clients.Others.receive(data);
        }
    }
}
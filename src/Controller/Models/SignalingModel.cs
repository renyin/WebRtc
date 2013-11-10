using System;

namespace WebRTCSample.Controller.Models
{
    public class SignalingModel : ISignalingModel
    {
        public string Message { get; set; }
        public Guid Recipient { get; set; }
        public Guid Sender { get; set; }
    }
}
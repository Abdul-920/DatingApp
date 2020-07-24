using DatingApp.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.API.Controllers
{
    public class ChatController
    {
        private readonly IHubContext<ChatHub> _chatHub;
        public ChatController(IHubContext<ChatHub> chatHub)
        {
            _chatHub = chatHub;
        }
    }
}
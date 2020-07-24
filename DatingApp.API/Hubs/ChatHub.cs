using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.API.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMapper _mapper;
        private readonly IDatingRepository _repo;
        public string ConnectionId { get; }

        public ChatHub(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public void SendMessageToEveryOne(Message message)
        {
            Clients.All.SendAsync("sendToAll", message);
        }

        public void SendPrivateMessage(string senderId , MessageForCreationDto messageForCreationDto)
        {
            messageForCreationDto.SenderId = int.Parse(senderId);

            var message = _mapper.Map<Message>(messageForCreationDto);

            //_repo.Add(message);

            //_repo.SaveAll();
            
            Clients.User(ClaimTypes.Name).SendAsync("sendPrivately", message);
            
        }
    }
}
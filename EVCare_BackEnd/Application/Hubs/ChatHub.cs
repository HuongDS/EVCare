using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Services;
using DataAccess.Dtos.MongoDb_Message;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Application.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatServices _chatServices;
        private readonly IConversationService _conversationService;
        private readonly IAiChatServices _aiChatServices;

        public ChatHub(IChatServices chatServices, IConversationService conversationService,
            IAiChatServices aiChatServices)
        {
            _chatServices = chatServices;
            _conversationService = conversationService;
            _aiChatServices = aiChatServices;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task SendMessage(string conversationId, string text, List<Attachment> atts)
        {
            var senderId = Context.UserIdentifier;
            var conv = await _chatServices.GetConversationAsync(conversationId);
            if (conv == null) throw new Exception("Conversation not found");
            var msg = await _chatServices.SaveMessageAsync(conversationId, senderId, text, atts);

            var sendData = new
            {
                id = msg.Id,
                conversationId = conversationId,
                senderId = senderId,
                text = msg.Text,
                attachments = atts,
                sentAt = msg.SentAt
            };
            await Clients.User(senderId.ToString()).SendAsync("ReceiveMessageAck", sendData);

            if (conv.Type == "AI")
            {
                var aiResponse = await _aiChatServices.GetChatResponseAsync(text);
                var aiMsg = await _chatServices.SaveMessageAsync(conversationId, "AI_BOT", aiResponse, null);
                var aiSendData = new
                {
                    id = aiMsg.Id,
                    conversationId = conversationId,
                    senderId = "AI_BOT",
                    text = aiMsg.Text,
                    attachments = aiMsg.Attachments,
                    sentAt = aiMsg.SentAt
                };
                await Clients.User(senderId.ToString()).SendAsync("ReceiveMessage", aiSendData);
            }
            else
            {
                var counterPart = await _conversationService.GetCounterpartAsync(conversationId, senderId);
                await Clients.User(counterPart.ToString()).SendAsync("ReceiveMessage", sendData);
            }

            await Clients.Group(conversationId.ToString()).SendAsync("UpdateConversation", new { conversationId });
        }
    }
}

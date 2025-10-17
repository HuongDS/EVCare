using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Services;
using DataAccess.Dtos.MongoDb_Message;
using Microsoft.AspNetCore.SignalR;

namespace Application.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatServices _chatServices;
        private readonly IConversationService _conversationService;

        public ChatHub(IChatServices chatServices, IConversationService conversationService)
        {
            _chatServices = chatServices;
            _conversationService = conversationService;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task SendMessage(int conversationId, string text, List<Attachment> atts)
        {
            var senderId = Context.UserIdentifier is null ? 0 : int.Parse(Context.UserIdentifier);
            var msg = await _chatServices.SaveMessageAsync(conversationId, senderId, text, atts);
            var counterPart = await _conversationService.GetCounterpartAsync(conversationId, senderId);

            await Clients.User(counterPart.ToString()).SendAsync("ReceiveMessage", new
            {
                id = msg.Id,
                conversationId = conversationId,
                senderId = senderId,
                text = msg.Text,
                attachments = atts,
                sentAt = msg.SentAt
            });
            await Clients.User(senderId.ToString()).SendAsync("ReceiveMessageAck", msg.Id.ToString());
            await Clients.Group(conversationId.ToString()).SendAsync("UpdateConversation", new { conversationId });
        }

        public async Task MaskAsRead(int conversationId, int upToMessageId)
        {
            var userId = Context.UserIdentifier is null ? 0 : int.Parse(Context.UserIdentifier);

            await _chatServices.MarkAsReadUpToAsync(conversationId, userId, upToMessageId);

            var counterPart = await _conversationService.GetCounterpartAsync(conversationId, userId);
            await Clients.User(userId.ToString()).SendAsync("UnreadChanged", new { conversationId, unread = 0 });
            await Clients.User(counterPart.ToString()).SendAsync("ReadReceipt", new { conversationId, readerId = userId, upToMessageId });
        }

        public async Task StartConsultation()
        {
            var customerId = Context.UserIdentifier is null ? 0 : int.Parse(Context.UserIdentifier);
            var conversation = await _conversationService.StartConsultationAsync(customerId);

            await Groups.AddToGroupAsync(Context.ConnectionId, conversation.Id.ToString());

            await Clients.User(conversation.Participants[1].AccountId.ToString()).SendAsync("NewConsultation", new
            {
                conversationId = conversation.Id,
                customerId
            });

            await Clients.User(customerId.ToString()).SendAsync("ConsultationStarted", new
            {
                conversationId = conversation.Id,
                staffId = conversation.Participants[1].AccountId
            });
        }

        public async Task StartTyping(int conversationId) => await Clients.Group(conversationId.ToString()).SendAsync("UserStartedTyping", new { conversationId, userId = Context.UserIdentifier });

        public async Task StopTyping(int conversationId) => await Clients.Group(conversationId.ToString()).SendAsync("UserStoppedTyping", new { conversationId, userId = Context.UserIdentifier });
    }
}

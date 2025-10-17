using System;
using System.Security.Claims;
using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using Application.Services;
using DataAccess.Dtos.MongoDb_Message;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly IChatServices _chatServices;
        private readonly IStaffRoutingService _staffRoutingService;

        public ChatController(IConversationService conversationService, IChatServices chatServices, IStaffRoutingService staffRoutingService)
        {
            _conversationService = conversationService;
            _chatServices = chatServices;
            _staffRoutingService = staffRoutingService;
        }

        [HttpPost("conversations/domain")]
        public async Task<IActionResult> CreateDomain([FromBody] CreateDomainDto dto)
        {
            var staffAccountId = await _staffRoutingService.FindAvailableAsync();
            var conversation = await _conversationService.CreateOrGetConsultationAsync(dto.customerAccountId, staffAccountId);
            return Ok(new ResponseDto<object>
            {
                statusCode = HttpStatus.OK,
                message = Application.Infrastructures.Message.DOMAIN_CREATE_SUCCESS,
                data = conversation.Id
            });
        }

        [HttpPost("consultations")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> StartConsultation()
        {
            var customerAccountId = (int)HttpContext.Items["AccountId"];
            var c = await _conversationService.StartConsultationAsync(customerAccountId);
            return Ok(new { conversationId = c.Id.ToString(), assignedTo = c.AssignedTo });
        }

        [HttpGet("conversations")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> List(int pageIndex = 1, int pageSize = 20)
        {
            var accountId = (int)HttpContext.Items["AccountId"];
            var (list, totalPages, totalItems) = await _conversationService.ListMineAsync(accountId, pageSize, pageIndex);
            return Ok(list.Select(c => new
            {
                id = c.Id,
                type = c.Type,
                lastMessage = c.LastMessage,
                updatedAt = c.UpdatedAt,
                unread = c.Unread.TryGetValue(accountId.ToString(), out var x) ? x : 0,
                participants = c.Participants
            }));
        }

        [HttpGet("history/{conversationId}")]
        public async Task<IActionResult> History(int conversationId, int skip = 0, int take = 30)
        {
            var list = await _chatServices.GetHistoryAsync(conversationId, skip, take);
            return Ok(list.OrderBy(m => m.SentAt).Select(m => new
            {
                id = m.Id,
                senderId = m.SenderId,
                receiverId = m.ReceiverId,
                text = m.Text,
                attachments = m.Attachments,
                sentAt = m.SentAt
            }));
        }

        [HttpPost("read/{conversationId}")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> Read(int conversationId, int upToMessageId)
        {
            var accountId = (int)HttpContext.Items["AccountId"];
            await _chatServices.MarkAsReadUpToAsync(conversationId, accountId, upToMessageId);
            await _conversationService.ResetUnreadAsync(conversationId, accountId);
            return Ok();
        }
    }
}

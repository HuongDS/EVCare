using System;
using System.Security.Claims;
using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using Application.Services;
using DataAccess.Dtos.MongoDb_Message;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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

        [HttpPost("conversations/domain/AI")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> CreateDomainWithAi()
        {
            var accountId = (int)HttpContext.Items["AccountId"];
            var conversation = await _conversationService.CreateOrGetConsultationAsync(accountId.ToString(), "AI_BOT");
            return Ok(new ResponseDto<string>
            {
                statusCode = HttpStatus.OK,
                message = Application.Infrastructures.Message.DOMAIN_CREATE_SUCCESS,
                data = conversation.Id
            });
        }

        [HttpPost("consultations")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> StartConsultation(int appointmentId)
        {
            try
            {
                var customerAccountId = HttpContext.Items["AccountId"];
                var c = await _conversationService.StartConsultationAsync(customerAccountId.ToString(), appointmentId);
                return Ok(new { conversationId = c.Id.ToString(), assignedTo = c.AssignedTo });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpGet("conversations")]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> List(int pageIndex = 1, int pageSize = 1000)
        {
            var accountId = HttpContext.Items["AccountId"];
            var (list, totalPages, totalItems) = await _conversationService.ListMineAsync(accountId.ToString(), pageSize, pageIndex);
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
        public async Task<IActionResult> History(string conversationId, int skip = 0, int take = 30)
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
        public async Task<IActionResult> Read(string conversationId, string upToMessageId)
        {
            var accountId = HttpContext.Items["AccountId"];
            await _chatServices.MarkAsReadUpToAsync(conversationId, accountId.ToString(), upToMessageId);
            await _conversationService.ResetUnreadAsync(conversationId, accountId.ToString());
            return Ok();
        }
    }
}

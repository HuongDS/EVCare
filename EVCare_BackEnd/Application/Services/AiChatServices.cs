using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.IService;
using Application.Service;
using DataAccess.Dtos.Service;
using GenerativeAI;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class AiChatServices : IAiChatServices
    {
        private readonly GenerativeModel _geminiModel;
        private readonly IServiceService _serviceService;
        private readonly IRedisService _redisService;

        public AiChatServices(IConfiguration configuration, IServiceService serviceService,
            IRedisService redisService)
        {
            var apiKey = configuration["AiService:ApiKey"]!;
            _geminiModel = new GenerativeModel(
                 apiKey: apiKey,
                 model: "gemini-2.0-flash"
                );

            _serviceService = serviceService;
            _redisService = redisService;
        }

        public async Task<string> GetChatResponseAsync(string userInput)
        {
            try
            {
                var allServices = await _redisService.GetObjectData<IEnumerable<ServiceViewModel>>("ALL_SERVICES_CACHE");
                string servicesAsJson;

                if (allServices is null)
                {
                    allServices = await _serviceService.GetAllServicesAsync();

                    await _redisService.SetObjectDataAsync("ALL_SERVICES_CACHE", allServices, TimeSpan.FromHours(1));
                }

                var options = new JsonSerializerOptions { WriteIndented = false };
                servicesAsJson = JsonSerializer.Serialize(allServices, options);

                string fullPromt = $"""
                    You are the EVCare virtual assistant.
                    
                    Here is the complete list of all services offered by EVCare, in JSON format.
                    You must use this data as your *only* source of truth for services.

                    --- SERVICE DATA (JSON) ---
                    {servicesAsJson}
                    --- END OF SERVICE DATA ---

                    Customer's question: {userInput}

                    Your tasks:
                    1. Read the customer's question and find the answer within the JSON data.
                    2. If the question is about a service (price, description) and the data is available, answer it. (e.g., "The [Service Name] service costs [Price] VND.")
                    3. If the data is empty or the question is too technical (e.g., how to fix a car), not related to the data, or you are unsure, politely encourage the customer to book an appointment ("go to the services tab and filling out the form").
                    
                    EVCare Assistant's answer (in Vietnamese):
                    """;

                var response = await _geminiModel.GenerateContentAsync(fullPromt);
                if (!string.IsNullOrEmpty(response.Text))
                {
                    return response.Text;
                }
                return "Sorry, I cannot process this request right now.";
            }
            catch (Exception ex)
            {
                return "Sorry, the AI ​​system (Gemini) is temporarily under maintenance. Error: " + ex.Message;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using GenerativeAI;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class AiChatServices : IAiChatServices
    {
        private readonly GenerativeModel _geminiModel;
        private readonly string _systemPrompt;

        public AiChatServices(IConfiguration configuration)
        {
            var apiKey = configuration["AiService:ApiKey"]!;
            _geminiModel = new GenerativeModel(
                 apiKey: apiKey,
                 model: "gemini-1.5-flash-latest"
                );

            _systemPrompt = "You are a virtual assistant of EVCare, an expert in electric vehicles and vehicle maintenance. Answer customer questions in a concise, friendly and helpful manner.";
        }

        public async Task<string> GetChatResponseAsync(string userInput)
        {
            try
            {
                string fullPromt = "This is a customer question: " + userInput + ". You answer it. If it is too technical beyond your control or knowledge that you are not sure, encourage the customer to make an appointment by going to the services tab and filling out the form. If the question is simple within control and you are sure that it is correct, then answer it.";
                var response = await _geminiModel.GenerateContentAsync(fullPromt);
                if (!string.IsNullOrEmpty(response.Text))
                {
                    return response.Text;
                }
                return "Sorry, I cannot process this request right now.";
            }
            catch (Exception ex)
            {
                return "Sorry, the AI ​​system (Gemini) is temporarily under maintenance.";
            }
        }
    }
}

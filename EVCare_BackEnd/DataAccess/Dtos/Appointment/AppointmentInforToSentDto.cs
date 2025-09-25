using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Appointment
{
    public class AppointmentInforToSentDto
    {
        public string email { get; set; }
        [JsonPropertyName("CenterName")]
        public string CenterName { get; set; } = default!;

        [JsonPropertyName("AppointmentDate")]
        public DateTime AppointmentDate { get; set; } = default!;

        [JsonPropertyName("CustomerName")]
        public string CustomerName { get; set; } = default!;

        [JsonPropertyName("CenterAddress")]
        public string CenterAddress { get; set; } = default!;

        [JsonPropertyName("ServiceList")]
        public string ServiceList { get; set; } = default!;

        [JsonPropertyName("Note")]
        public string? Note { get; set; }

        [JsonPropertyName("ConfirmUrl")]
        public string ConfirmUrl { get; set; } = default!;

        [JsonPropertyName("CancelUrl")]
        public string CancelUrl { get; set; } = default!;
        public int customerId { get; set; }
    }
}

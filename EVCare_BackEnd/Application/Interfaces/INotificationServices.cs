using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Vehicle;

namespace Application.Interfaces
{
    public interface INotificationServices
    {
        Task SendAppointmentInforAsync(AppointmentViewDetailModel data);
        Task SendInvoiceToCustomer(InvoiceMailDto dto);
        Task<string> SendOTP(string email, int expires);

        Task SendEmailToRemider(VehicleReminderDto model);
    }
}

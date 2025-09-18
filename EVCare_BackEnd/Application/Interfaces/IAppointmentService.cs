using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;

namespace Application.Interfaces
{
    public interface IAppointmentService
    {
        Task<int> CreateAppointment(AppointmentCreateModel model);  
        Task<bool> UpdateAppointment(AppointmentUpdateModel model,int employeeId);
        Task<bool> DeleteAppointment(int appointmentId);
        Task<AppointmentViewDetailModel> GetAppointmentByiD(int appointmentIdId);
       
    }
}

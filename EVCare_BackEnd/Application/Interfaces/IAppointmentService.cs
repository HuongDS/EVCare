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
    }
}

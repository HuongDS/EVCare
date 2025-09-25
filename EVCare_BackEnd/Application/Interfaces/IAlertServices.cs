using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Alerts;

namespace Application.Interfaces
{
    public interface IAlertServices
    {
        Task AddConfirmAlertAsync(AlertCreateDto data);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Interfaces;

namespace Application.Services
{

    public class AlertServices : IAlertServices
    {
        private readonly IAlertRepository _alertRepository;

        public AlertServices(IAlertRepository alertRepository)
        {
            this._alertRepository = alertRepository;
        }
    }
}

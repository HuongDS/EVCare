using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Parttern
{
    public static class RegexPartterns
    {
        public const string PASSWORD_PATTERN = @"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";
        public const string PHONE_NUMBER_PATTERN = @"^(?:\+84|0084|0)([35789]\d{8})$";
        public const string EMAIL_PATTERN = @"^(([^<>()[\]\\.,;:\s@""]+(\.[^<>()[\]\\.,;:\s@""]+)*)|("".+""))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$";
    }
}

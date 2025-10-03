using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Application.Helper
{
    public class FormatHelper
    {
        public static string BuildServiceListPlain(List<string> services)
        {
            if (services == null || services.Count == 0) return "• Services: —";
            var lines = services.Select(s => $"  • {s}");
            return "• Services:\n" + string.Join("\n", lines);
        }
       public static string FormatAmount(decimal amount, string currencySuffix = " VND")
        {
            return amount.ToString("#,0", CultureInfo.GetCultureInfo("vi-VN")) + currencySuffix;
        }

       public static string FormatLocalDateTime(DateTime completedAtUtc)
        {
            var tzId = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
                        ? "SE Asia Standard Time"         
                        : "Asia/Ho_Chi_Minh";             
            var tz = TimeZoneInfo.FindSystemTimeZoneById(tzId);
            var local = TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(completedAtUtc, DateTimeKind.Utc), tz);
            return local.ToString("MMM dd, yyyy HH:mm");   
        }
    }
}

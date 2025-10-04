using System.Diagnostics;

namespace API.Middlewares
{
    public class RateLimitMiddleware
    {
        private readonly RequestDelegate _next;

        private static readonly object _gate = new();
        private static readonly Stopwatch _sw = Stopwatch.StartNew();
        private static int _count = 0;

        private readonly int _limit;
        private readonly TimeSpan _window;
        public RateLimitMiddleware(RequestDelegate next, int limit = 50, double seconds = 1.0)
        {
            _next = next;
            _limit = limit;
            _window = TimeSpan.FromSeconds(seconds);
        }
    }
}

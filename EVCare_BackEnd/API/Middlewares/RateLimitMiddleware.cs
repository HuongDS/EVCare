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
        public RateLimitMiddleware(RequestDelegate next, int limit = 50, double seconds = 5.0)
        {
            _next = next;
            _limit = limit;
            _window = TimeSpan.FromSeconds(seconds);
        }
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/hubs", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            bool reject;
            double retryAfterSec;

            lock (_gate)
            {
                var elapsed = _sw.Elapsed;

                if (elapsed >= _window)
                {
                    _sw.Restart();
                    _count = 0;
                }

                if (_count >= _limit)
                {
                    reject = true;
                    retryAfterSec = Math.Max(0.001, (_window - elapsed).TotalSeconds);
                }
                else
                {
                    _count++;
                    reject = false;
                    retryAfterSec = 0;
                }
            }

            if (reject)
            {
                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.Headers["Retry-After"] = Math.Ceiling(retryAfterSec).ToString();
                await context.Response.WriteAsync("Too many requests. Try again later.");
                return;
            }

            await _next(context);
        }
    }
}

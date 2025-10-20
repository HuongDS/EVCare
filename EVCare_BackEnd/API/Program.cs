using System.Security.Authentication;
using System.Text;
using API.Filters;
using API.Hubs;
using API.Middlewares;
using Application.DomainEvents;
using Application.Hubs;
using Application.Interfaces;
using Application.IService;
using Application.Mapping;
using Application.Mappings;
using Application.Planner;
using Application.Service;
using Application.Services;
using Application.Validators.Appointment;
using Application.Validators.BlockDate;
using Application.Validators.Order;
using Application.Validators.Part;
using Application.Validators.Service;
using Application.Validators.Vehicle;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using QuestPDF.Infrastructure;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();
QuestPDF.Settings.License = LicenseType.Community;
// Add services to the container.
builder.Services.AddControllers()
    .AddFluentValidation()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// SignalR
//builder.Services.AddSignalR();
builder.Services.AddSignalR()
    .AddAzureSignalR(builder.Configuration["Azure:SignalR:ConnectionString"]);


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<EVCareDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlServerOptionsAction: sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 10,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }));

// DbContext
//builder.Services.AddScoped<IEVCareDbContext, EVCareDbContext>();
builder.Services.AddHttpClient();
// Repositories
builder.Services.AddScoped<IGenericRepository<Account>, GenericRepository<Account>>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IGenericRepository<RefreshToken>, GenericRepository<RefreshToken>>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IGenericRepository<Customer>, GenericRepository<Customer>>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IGenericRepository<Employee>, GenericRepository<Employee>>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IGenericRepository<Technician>, GenericRepository<Technician>>();
builder.Services.AddScoped<ITechnicianRepository, TechnicianRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IVehicleCategoryRepository, VehicleCategoryRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IAppointmentServiceRepository, AppointmentServiceRepository>();
builder.Services.AddScoped<IAppointmentImageRepository, AppointmentImageRepository>();
builder.Services.AddScoped<IServiceCenterRepository, ServiceCenterRepository>();
builder.Services.AddScoped<IServiceCategoryRepository, ServiceCategoryRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IBlockedDateRepository, BlockedDateRepository>();
builder.Services.AddScoped<IGenericRepository<DataAccess.Entities.Order>, GenericRepository<DataAccess.Entities.Order>>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderPartRepository, OrderPartRepository>();
builder.Services.AddScoped<IGenericCategoryRepository<Part>, GenericCategoryRepository<Part>>();
builder.Services.AddScoped<IPartRepository, PartRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<IAlertRepository, AlertRepository>();
builder.Services.AddScoped<IServiceCenterRepository, ServiceCenterRepository>();
builder.Services.AddScoped<ITechnicianWorkingSessionRepository, TechnicianWorkingSessionRepository>();
builder.Services.AddScoped<IPartCategoryRepository, PartCategoryRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<ITechnicianSkillRepository, TechnicianSkillRepository>();
builder.Services.AddScoped<IPartHistoryRepository, PartHistoryRepository>();



// Services
builder.Services.AddScoped<IAuthServices, AuthServices>();
builder.Services.AddScoped<ITokenServices, TokenServices>();
builder.Services.AddScoped<INotificationServices, NotificationServices>();
builder.Services.AddScoped<IOtpServices, OtpServices>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IVehicleCategoryService, VehicleCategoryService>();
builder.Services.AddScoped<IAppointmentService, Application.Services.AppointmentService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<IServiceCategoryService, ServiceCategoryService>();
builder.Services.AddScoped<IBlockedDateService, BlockedDateService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAlertServices, AlertServices>();
builder.Services.AddScoped<IApplicationServices, ApplicationServices>();
builder.Services.AddScoped<IEmployeeServices, EmployeeServices>();
builder.Services.AddScoped<ILinkServices, LinkServices>();
builder.Services.AddScoped<IServiceCenterService, ServiceCenterService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ITechnicianService, TechnicianService>();
builder.Services.AddScoped<IPartService, PartService>();
builder.Services.AddScoped<ITechnicianWorkingSessionService, TechnicianWorkingSessionService>();
builder.Services.AddScoped<IPartCategoryService, PartCategoryService>();
builder.Services.AddScoped<IReplenishmentPlanner, GeminiReplenishmentPlanner>();
builder.Services.AddHttpClient<IPayOSGateWay, PayOSGateWay>();
builder.Services.AddScoped<IPayOSService, PayOSService>();
builder.Services.AddScoped<IRedisService, RedisService>();
builder.Services.AddScoped<IAdminDashboardServices, AdminDashboardServices>();

builder.Services.AddScoped<ITechnicianSkillService, TechnicianSkillService>();
//builder.Services.AddHttpClient<IAiInsightServices, AiInsightServices>(c =>
//{
//    c.BaseAddress = new Uri(builder.Configuration["AiService:BaseUrl"]!);
//});
builder.Services.AddHttpClient<IAiInsightServices, AiInsightServices>(c =>
{
    c.BaseAddress = new Uri("https://generativelanguage.googleapis.com/v1beta/");
});
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IChatServices, ChatServices>();
builder.Services.AddScoped<IConversationService, ConversationService>();
builder.Services.AddScoped<IStaffRoutingService, StaffRoutingService>();

//builder.Services.AddScoped<IAiInsightServices, MockAiInsightServices>();
builder.Services.AddScoped<OnInvoiceCompleteHandler>();
builder.Services.AddScoped<OnAppointmentConfirmHandler>();


// AutoMapper
builder.Services.AddAutoMapper(typeof(ServiceProfile));
builder.Services.AddAutoMapper(typeof(VehicleProfile));
builder.Services.AddAutoMapper(typeof(VehicleCategoryProfile));
builder.Services.AddAutoMapper(typeof(AppointmentProfile));
builder.Services.AddAutoMapper(typeof(AccountProfile));
builder.Services.AddAutoMapper(typeof(PartCategoryProfile));
builder.Services.AddAutoMapper(typeof(PartHistoryProfile));
//builder.Services.AddAutoMapper(typeof(ServiceCenterProfile));

//Action Filter
builder.Services.AddScoped<AuthorizeVehicleOwnerFilter>();
builder.Services.AddScoped<SetCustomerIdFilter>();
builder.Services.AddScoped<AuthorizeCustomerOrStaffFilter>();
builder.Services.AddScoped<AppointmentOwnershipFilter>();
builder.Services.AddScoped<SetEmployeeIdFilter>();
builder.Services.AddScoped<GetAccountIdFilter>();
builder.Services.AddScoped<AuthorizeCustomerAndStaffThroughAccountIdFilter>();
builder.Services.AddScoped<AppointmentAuthorizationFilter>();
builder.Services.AddScoped<SetAccountIdFilter>();
builder.Services.AddScoped<SetTechnicianIdFilter>();
builder.Services.AddScoped<AuthorizeTechnicianDetail>();
builder.Services.AddScoped<ValidateInvoiceTotalFilter>();
builder.Services.AddScoped<CheckAuthorizationOfCustomerFilter>();

//Background Job
builder.Services.AddScoped<IAppointmentExpiryJob, AppointmentExpiryJob>();
builder.Services.AddScoped<IReminderService, ReminderService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();

//Validator
builder.Services.AddValidatorsFromAssemblyContaining<CreateServiceRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UpdateServiceRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderUpdateModelValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderPartUpdateModelValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateVehivleModelValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<AppointmentCustomerCreateModelValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<BlockedDatePostModelValidator>();



// Add Cors
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", builder =>
//    {
//        builder.WithOrigins("https://localhost:7228", "http://localhost:5173")
//                .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials();
//    });
//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p
        .WithOrigins("https://localhost:5173", "http://localhost:5173", "https://ev-care.netlify.app", "https://localhost:7228", "https://evcare.service.signalr.net")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// MongoDb
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(builder.Configuration.GetConnectionString("MongoDb")));
builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(builder.Configuration["Chat:Database"] ?? "EVCare");
});

// Authentication
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
    opt.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/hubs/adminDashboard")) &&
                (path.StartsWithSegments("/hubs/chat")))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
})

    .AddGoogle(opt =>
    {
        opt.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        opt.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
        opt.CallbackPath = "/google-callback";
    });

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "EVCare API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập 'Bearer {token}' vào đây"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddAuthorization();

System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

////Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var redisConfig = builder.Configuration.GetConnectionString("Redis");
    if (string.IsNullOrWhiteSpace(redisConfig))
        throw new InvalidOperationException("ConnectionStrings:Redis is empty on Azure.");
    var options = ConfigurationOptions.Parse(redisConfig);

    options.Ssl = true;
    options.AbortOnConnectFail = false;
    options.SslHost = "exotic-dogfish-51279.upstash.io";
    options.SslProtocols = SslProtocols.Tls12;            // ép dùng TLS 1.2
    options.ConnectRetry = 3;
    options.ConnectTimeout = 15000; // 15s
    options.SyncTimeout = 15000;    // 15s
    options.KeepAlive = 60;
    options.User = "default";

    return ConnectionMultiplexer.Connect(options);
});
//builder.Services.AddStackExchangeRedisCache(o => { o.Configuration = builder.Configuration["Redis:ConnectionString"]; });

//hangfire
builder.Services.AddHangfire(cfg => cfg
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new Hangfire.SqlServer.SqlServerStorageOptions { PrepareSchemaIfNecessary = true }));


var app = builder.Build();

var tzVn = TimeZoneInfo.FindSystemTimeZoneById(OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh");

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAllowAllDashboardAuthorizationFilter() },

});

// Configure the HTTP request pipeline.
var swaggerEnabled = builder.Configuration.GetValue<bool>("SwaggerEnabled");

if (swaggerEnabled)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//app.UseSwagger();
//app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");



app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<RateLimitMiddleware>();
app.UseMiddleware<BannedMiddleware>();

app.UseHangfireServer();
RecurringJob.AddOrUpdate<IAppointmentExpiryJob>("cancel-expired-appointments-daily-7am", job => job.CancelAppointment(), Cron.Daily(7), tzVn);
RecurringJob.AddOrUpdate<IReminderService>("reminder-service", job => job.SendEmailRemindersAsync(), Cron.Daily(10), tzVn);
RecurringJob.AddOrUpdate<IAttendanceService>("attendance-service", job => job.MarkAttendanceAsync(), Cron.Daily(5), tzVn);


app.MapControllers();
//app.MapHub<AdminDashboardHub>("/hubs/adminDashboard");
app.UseAzureSignalR(routes =>
{
    routes.MapHub<AdminDashboardHub>("/hubs/adminDashboard");
    routes.MapHub<ChatHub>("/hubs/chat");
});
//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapHub<AdminDashboardHub>("/hubs/adminDashboard");
//});
app.Run();

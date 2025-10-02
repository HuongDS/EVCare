using System.Net;
using System.Security.Authentication;
using System.Text;
using API.Filters;
using API.Middlewares;
using Application.Interfaces;
using Application.IService;
using Application.Jobs;
using Application.Mapping;
using Application.Mappings;
using Application.Service;
using Application.Services;
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
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddFluentValidation();
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
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();



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


// AutoMapper
builder.Services.AddAutoMapper(typeof(ServiceProfile));
builder.Services.AddAutoMapper(typeof(VehicleProfile));
builder.Services.AddAutoMapper(typeof(VehicleCategoryProfile));
builder.Services.AddAutoMapper(typeof(AppointmentProfile));
builder.Services.AddAutoMapper(typeof(AccountProfile));
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



// Add Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.WithOrigins("https://localhost:7228", "http://localhost:5173")
                .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
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

//hangfire
builder.Services.AddHangfire(cfg => cfg
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new Hangfire.SqlServer.SqlServerStorageOptions { PrepareSchemaIfNecessary = true }));
builder.Services.AddHangfireServer();

var app = builder.Build();
app.UseHangfireDashboard("/hangfire");
var tzVn = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
RecurringJob.AddOrUpdate<IAppointmentExpiryJob>(
       "cancel-expired-appointments-daily-7am",
       job => job.CancelAppointment(),
        Cron.Daily(7),
       tzVn
    );
RecurringJob.AddOrUpdate<IReminderService>(
    "reminder-service",
     job=>job.SendEmailRemindersAsync(),
     Cron.Daily(10),
     tzVn
    );
RecurringJob.AddOrUpdate<IAttendanceService>(
    "attendacne-service",
    job=>job.MarkAttendanceAsync(),
    Cron.Daily(5),
    tzVn
    );
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

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseMiddleware<BannedMiddleware>();



app.UseAuthorization();

app.MapControllers();

app.Run();

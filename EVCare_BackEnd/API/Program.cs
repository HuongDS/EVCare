using System.Net;
using System.Security.Authentication;
using System.Text;
using API.Filters;
using Application.Interfaces;
using Application.IService;
using Application.Mapping;
using Application.Mappings;
using Application.Service;
using Application.Services;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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
// AutoMapper
builder.Services.AddAutoMapper(typeof(ServiceProfile));
builder.Services.AddAutoMapper(typeof(VehicleProfile));
builder.Services.AddAutoMapper(typeof(VehicleCategoryProfile));
builder.Services.AddAutoMapper(typeof(AppointmentProfile));
//Action Filter
builder.Services.AddScoped<AuthorizeVehicleOwnerFilter>();
builder.Services.AddScoped<SetCustomerIdFilter>();
builder.Services.AddScoped<AuthorizeCustomerOrAdminFilter>();
// Add Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.WithOrigins("https://localhost:7228")
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
    var options = ConfigurationOptions.Parse(redisConfig);

    options.Ssl = true;
    options.AbortOnConnectFail = false;
    options.SslHost = "exotic-dogfish-51279.upstash.io";

    return ConnectionMultiplexer.Connect(options);
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
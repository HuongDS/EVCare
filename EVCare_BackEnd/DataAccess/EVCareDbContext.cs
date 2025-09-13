using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Configuration;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class EVCareDbContext : DbContext, IEVCareDbContext
    {

        public EVCareDbContext(DbContextOptions<EVCareDbContext> options) : base(options)
        {
        }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehiclesCategory> VehiclesCategories { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<PartCategory> PartCategories { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Salary> Salaries { get; set; }
        public DbSet<TechnicianCategory> TechnicianCategories { get; set; }
        public DbSet<Technician> Technicians { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<Appointmentimage> AppointmentImages { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        //public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<TechnicianSkill> TechnicianSkills { get; set; }
        public DbSet<ReviewEmployee>ReviewEmployees { get; set; }
        public DbSet<OrderPart> OrderParts { get; set; }
        public DbSet<TechnicianWorkingSession>TechnicianWorkingSessions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new VehicleCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new AcccountConfigutation());
            modelBuilder.ApplyConfiguration(new CustomerConfiguration());
            modelBuilder.ApplyConfiguration(new VehicleConfiguration());
            modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
            modelBuilder.ApplyConfiguration(new RefreshTokenConfigurtation());
            modelBuilder.ApplyConfiguration(new TechnicianCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new TechnicianConfiguration());
            modelBuilder.ApplyConfiguration(new ServiceConfiguration());
            //modelBuilder.ApplyConfiguration(new ServiceCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new TechnicianSkillConfigruation());
            modelBuilder.ApplyConfiguration(new SalaryConfiguration());
            modelBuilder.ApplyConfiguration(new ApplicationConfiguration());
            modelBuilder.ApplyConfiguration(new PartCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new PartConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentServiceConfigurations());
            modelBuilder.ApplyConfiguration(new ReviewConfiguration());
            modelBuilder.ApplyConfiguration(new ReviewEmployeeConfiguration());
            modelBuilder.ApplyConfiguration(new OrderConfiguration());
            modelBuilder.ApplyConfiguration(new TechnicianWorkingSessionConfiguration());
            modelBuilder.ApplyConfiguration(new OrderPartConfiguration());
            modelBuilder.ApplyConfiguration(new AlertConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentImageConfiguration());
            modelBuilder.ApplyConfiguration(new InvoiceConfiguration());

        }
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }

    }
}

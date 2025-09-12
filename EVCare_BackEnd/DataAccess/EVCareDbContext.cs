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


        public DbSet<Account> Accounts { get; set; }
        public DbSet<Salary> Salaries { get; set; }

        public DbSet<TechnicianCategory> TechnicianCategories { get; set; }
        public DbSet<Technician> Technicians { get; set; }
        //public DbSet<Alert> Alerts { get; set; }
        //public DbSet<Application> Applications { get; set; }
        //public DbSet<Appointment> Appointments { get; set; }
        //public DbSet<AppointmentImages> AppointmentImages { get; set; }
        //public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<TechnicianSkill> TechnicianSkills { get; set; }
        //public DbSet<Invoices> Invoices { get; set; }
        //public DbSet<Order> Orders { get; set; }
        //public DbSet<OrderParts> OrderParts { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer("Server=evcare-db.xxxxx.ap-southeast-1.rds.amazonaws.com,1433;Database=EVCare;User Id=admin;Password=Top1swp391herewego;Encrypt=True;TrustServerCertificate=True;");
        }
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
            modelBuilder.ApplyConfiguration(new ServiceCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new TechnicianSkillConfigruation());
            modelBuilder.ApplyConfiguration(new SalaryConfiguration());
            modelBuilder.ApplyConfiguration(new ApplicationConfiguration());
        }
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }

    }
}

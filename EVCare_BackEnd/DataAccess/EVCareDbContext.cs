using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Configuration;
using DataAccess.Configurations;
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
        public DbSet<DataAccess.Entities.Application> Applications { get; set; }
        public DbSet<PartCategory> PartCategories { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Account> Accounts { get; set; }
       
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<Technician> Technicians { get; set; }
        public DbSet<AppointmentPartCondition> AppointmentPartConditions{ get; set; }
        public DbSet<PartHistory>  PartHistories { get; set; }
        public DbSet<VehiclePartCompatibility> VehiclePartCompatibilities { get; set; }
        public DbSet<Order> Orders { get; set; }
        
        public DbSet<Appointmentimage> AppointmentImages { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<ServiceCenter> ServiceCenters {  get; set; }
        public DbSet<CenterUnavailableDays> CenterUnavailableDays { get; set; }
        public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<TechnicianSkill> TechnicianSkills { get; set; }
        public DbSet<ServicePart> ServiceParts { get; set; }

        public DbSet<OrderPart> OrderParts { get; set; }
        public DbSet<TechnicianWorkingSession> TechnicianWorkingSessions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new VehicleCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new AcccountConfigutation());
            modelBuilder.ApplyConfiguration(new CustomerConfiguration());
            modelBuilder.ApplyConfiguration(new VehicleConfiguration());
            modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
            modelBuilder.ApplyConfiguration(new RefreshTokenConfigurtation());
            modelBuilder.ApplyConfiguration(new ServiceCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new TechnicianConfiguration());
            modelBuilder.ApplyConfiguration(new ServiceConfiguration());
            modelBuilder.ApplyConfiguration(new TechnicianSkillConfigruation());
            modelBuilder.ApplyConfiguration(new ApplicationConfiguration());
            modelBuilder.ApplyConfiguration(new PartCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new PartConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentServiceConfigurations());
            modelBuilder.ApplyConfiguration(new ReviewConfiguration());
            modelBuilder.ApplyConfiguration(new OrderConfiguration());
            modelBuilder.ApplyConfiguration(new TechnicianWorkingSessionConfiguration());
            modelBuilder.ApplyConfiguration(new OrderPartConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentImageConfiguration());
            modelBuilder.ApplyConfiguration(new InvoiceConfiguration());
            modelBuilder.ApplyConfiguration(new PartHistoryConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentPartConditionConfiguration());
            modelBuilder.ApplyConfiguration(new VehiclePartCompatibilityConfiguration());
            modelBuilder.ApplyConfiguration(new ServicePartConfiguration());

        }
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }

    }
}

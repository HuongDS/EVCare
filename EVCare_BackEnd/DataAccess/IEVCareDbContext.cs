using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace DataAccess
{
    public interface IEVCareDbContext
    {
        public DbSet<ServiceCenter> ServiceCenters { get; set; }
        public DbSet<CenterUnavailableDays> CenterUnavailableDays { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehiclesCategory> VehiclesCategories { get; set; }
        public DbSet<TechnicianSkill> TechnicianSkills { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<ServiceCategory> ServiceCategories
        {
            get; set;
        }
        public DbSet<Technician> Technicians { get; set; }
        //public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<PartCategory> PartCategories { get; set; }
        public DbSet<Part> Parts { get; set; }
        
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Appointmentimage> AppointmentImages { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<DataAccess.Entities.Application> Applications { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<Review> Reviews { get; set; }
        
        public DbSet<Order> Orders { get; set; }
        public DbSet<TechnicianWorkingSession> TechnicianWorkingSessions { get; set; }
        public DbSet<OrderPart> OrderParts { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        DatabaseFacade Database { get; }
        public Task<int> SaveChangesAsync();
    }
}

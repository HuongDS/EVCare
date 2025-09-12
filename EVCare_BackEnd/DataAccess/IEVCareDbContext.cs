using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public interface IEVCareDbContext
    {
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehiclesCategory> VehiclesCategories { get; set; }
        public DbSet<TechnicianSkill> TechnicianSkills { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<TechnicianCategory> TechnicianCategories { get; set; }
        public DbSet<Technician> Technicians { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<Service> Services { get; set; }
        //DbSet<Alert> Alerts { get; set; }
        //DbSet<Application> Applications { get; set; }
        //DbSet<Appointment> Appointments { get; set; }
        //DbSet<AppointmentImages> AppointmentImages { get; set; }
        //DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<Salary> Salaries { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        DbSet<Application> Applications { get; set; }

        //DbSet<Invoices> Invoices { get; set; }
        //DbSet<Order> Orders { get; set; }
        //DbSet<OrderParts> OrderParts { get; set; }
        public Task<int> SaveChangesAsync();
    }
}

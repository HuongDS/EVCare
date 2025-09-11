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
        DbSet<Vehicle> Vehicles { get; set; }
        DbSet<VehiclesCategory> VehiclesCategories { get; set; }
        DbSet<Account> Accounts { get; set; }
        //DbSet<Alert> Alerts { get; set; }
        //DbSet<Application> Applications { get; set; }
        //DbSet<Appointment> Appointments { get; set; }
        //DbSet<AppointmentImages> AppointmentImages { get; set; }
        //DbSet<AppointmentService> AppointmentServices { get; set; }
        DbSet<Customer> Customers { get; set; }
        DbSet<Employee> Employees { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        //DbSet<Invoices> Invoices { get; set; }
        //DbSet<Order> Orders { get; set; }
        //DbSet<OrderParts> OrderParts { get; set; }
        public Task<int> SaveChangesAsync();
    }
}

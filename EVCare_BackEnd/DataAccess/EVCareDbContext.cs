using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class EVCareDbContext : DbContext, IEVCareDbContext
    {
        public EVCareDbContext(DbContextOptions<EVCareDbContext> options) : base(options)
        {
        }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentImages> AppointmentImages { get; set; }
        public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Invoices> Invoices { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderParts> OrderParts { get; set; }

    }
}

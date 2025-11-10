using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Enums;
using DocumentFormat.OpenXml.InkML;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace IntegrationTests {
    public class DataBaseFixture {
        private static object _lock = new object();
        private bool _isDatabaseCreated = false;
        public DataBaseFixture() {

            lock (_lock) {
                if (_isDatabaseCreated) {
                    return;
                }
                using EVCareDbContext context = CreateContext();
                SeedTestData(context);

                _isDatabaseCreated = true;
            }

        }

        private void SeedTestData(EVCareDbContext context) {

            var account = new Account
            {
                Id = 1,
                First_Name = "Phuc",
                Last_Name = "Sanh",
                Phone = "0901234567",
                Email = "npsdn1906@gmail.com"
            };

       
            var customer = new Customer
            {
                Id = 1,
                AccountId = 1,
                Account = account
            };

        
            var category = new VehiclesCategory
            {
                Id = 1,
                Name = "Sedan"
            };

         
            var vehicle = new Vehicle
            {
                Id = 1,
                LicensePlate = "ABC123",
                CategoryId = 1,
                Category = category
            };

         
            var service = new Service
            {
                Id = 1,
                Name = "Oil Change",
                Description  = "abczyx"
            };
            var appointment = new Appointment
            {
                Id = 1,
                Appointment_Date = DateTime.Now.AddDays(1),
                Status = AppointmentStatusEnum.Pending,
                VehicleId = 1,
                Vehicle = vehicle,
                CustomerId = 1,
                Customer = customer,
                AppointmentServices = new List<AppointmentService>
        {
            new AppointmentService
            {
                AppointmentId = 1,
                ServiceId = 1,
                Service = service
            }
        }
            };

            context.Accounts.Add(account);
            context.Customers.Add(customer);
            context.VehiclesCategories.Add(category);
            context.Vehicles.Add(vehicle);
            context.Services.Add(service);
            context.Appointments.Add(appointment);

            context.SaveChanges();

        }

        public  EVCareDbContext CreateContext() {
            var options = new DbContextOptionsBuilder<EVCareDbContext>()
                .UseInMemoryDatabase(databaseName: "EVCareTestDb") 
                .Options;

          

            var context = new EVCareDbContext(options);
            return context;
        }
    }
}

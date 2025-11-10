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
        private void SeedTestData(EVCareDbContext context) {

            var accountCustomer = new Account { Id = 1, First_Name = "Phuc", Last_Name = "Sanh", Phone = "0901234567", Email = "phuc@example.com" };
            var accountEmployee = new Account { Id = 2, First_Name = "Huong", Last_Name = "Tran", Phone = "0902222333", Email = "huongtran@example.com" };

            var customer = new Customer { Id = 1, AccountId = 1, Account = accountCustomer };
            var employee = new Employee {
                Id = 1, AccountId = 2, Account = accountEmployee,
                Status = EmployeeStatusEnum.Available 
                ,CCCD = "123456789",
            };

         
            var technician = new Technician { Id = 1, EmployeeId = 1, Employee = employee, ExpYear = 5 };

         
            var category = new VehiclesCategory { Id = 1, Name = "Sedan" };
            var vehicle = new Vehicle { Id = 1, LicensePlate = "ABC123", CategoryId = 1, Category = category };

         
            var oilChange = new Service { Id = 1, Name = "Oil Change", Description = "Thay dầu nhớt" };
            var brakeCheck = new Service { Id = 2, Name = "Brake Check", Description = "Kiểm tra phanh" };

        
            var techSkill = new TechnicianSkill {   TechnicianId = 1, Technician = technician, ServiceId = 1, Service = oilChange };

        
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
                        new AppointmentService { AppointmentId = 1, ServiceId = 1, Service = oilChange }
                    }
            };

       
            var part = new Part { 
                Id = 1, 
                Name = "Engine Oil",
                Image = "oil.png", Stock = 10, Price = 500, ReplacementPrice = 1000,
                Description = "ABC" 
            };
            var order = new Order
            {
                Id = 1,
                AppointmentId = 1,
                Appointment = appointment,
                OrderParts = new List<OrderPart>
                    {
                        new OrderPart { TechnicianId = 1,OrderId = 1, PartId = 1, Part = part, Quantity = 1, Price = 500, ReplacementPrice = 1000 }
                    }
            };
            appointment.Order = order;
            appointment.OrderId = order.Id;

          
            var tws = new TechnicianWorkingSession
            {
                OrderId = 1,
                TechnicianId = 1,
                Technician = technician,
                Status = TechnicianWorkingSessionEnum.InProgress
            };

            context.Accounts.AddRange(accountCustomer, accountEmployee);
            context.Customers.Add(customer);
            context.Employees.Add(employee);
            context.Technicians.Add(technician);
            context.VehiclesCategories.Add(category);
            context.Vehicles.Add(vehicle);
            context.Services.AddRange(oilChange, brakeCheck);
            context.TechnicianSkills.Add(techSkill);
            context.Parts.Add(part);
            context.Orders.Add(order);
            context.Appointments.Add(appointment);
            context.OrderParts.Add(order.OrderParts.First());
            context.TechnicianWorkingSessions.Add(tws);

            context.SaveChanges();

        }

        public EVCareDbContext CreateContext() {
            var options = new DbContextOptionsBuilder<EVCareDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) 
                .Options;

            var context = new EVCareDbContext(options);
            SeedTestData(context); 
            return context;
        }

    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.CenterCare;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Dtos.PartCategory;
using DataAccess.Dtos.Payment;
using DataAccess.Dtos.Service;
using DataAccess.Dtos.Technician;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository {
        public AppointmentRepository(EVCareDbContext dbContext) : base(dbContext) {
        }
        public async Task UpdateAppointmentStatusAsync(int appointmentID, AppointmentStatusEnum status) {
            var entity = await _dbSet.FirstOrDefaultAsync(e => e.Id == appointmentID);
            if (entity is null) {
                throw new Exception($"Entity with id = {appointmentID} is not found.");
            }
            entity.Status = status;
            if (status == AppointmentStatusEnum.Canceled) {
                entity.Deleted_At = DateTime.Now;
            }
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<PageResultDto<Appointment>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex) {
            var startDate = currentDate.ToDateTime(TimeOnly.MinValue);
            var endDate = currentDate.ToDateTime(TimeOnly.MaxValue);
            var appointments = _dbSet.Where(a => a.EmployeeId == employeeID && a.Status == status && a.Appointment_Date >= startDate && a.Appointment_Date <= endDate).AsQueryable();
            return await PaginationHelper.PaginationAsync(appointments, pageSize, pageIndex);
        }
        public async Task<PageResultDto<Appointment>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex) {
            var appointments = _dbSet.Where(a => a.EmployeeId == employeeID && a.Status == status).AsQueryable();
            return await PaginationHelper.PaginationAsync(appointments, pageSize, pageIndex);
        }

        public async Task<int> CountAppointmentsPerDay(int customerId) {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            return await _dbSet.CountAsync(x =>
                x.CustomerId == customerId
                && x.Create_At >= today
                && x.Create_At < tomorrow
            );
        }

        public async Task<int> CountAppointmnetToday() {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            return await _dbSet.CountAsync(x =>

                x.Create_At >= today
                && x.Create_At < tomorrow
                );
        }

        public async Task<IEnumerable<AppointmentViewModel>> GetAppointmentsByCustomerId(int customerId) {

            return await _dbContext.Appointments.Where(a => a.CustomerId == customerId)
                .Include(a => a.Customer).ThenInclude(a => a.Account)
                .Include(a => a.Vehicle).ThenInclude(v => v.Category)
                .Include(a => a.AppointmentServices).ThenInclude(asv => asv.Service)
                .Include(a => a.AppointmentImages)
                .Select(a => new AppointmentViewModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    Services = a.AppointmentServices.Select(x => new Dtos.Service.ServiceViewFormModel
                    {
                        Id = x.ServiceId,
                        Name = x.Service.Name
                    }).ToList(),
                    Status = a.Status,
                    VehicleModel = a.Vehicle.Category.Name,
                    AppointmentImages = a.AppointmentImages.Select(x => x.Image).ToList(),
                    Note = a.Note,
                    CustomerName = a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name,
                    PhoneNumber = a.Customer.Account.Phone,
                    ReviewId = a.ReviewId
                }).ToListAsync();

        }

        public async Task<PageResultDto<AppointmentViewModel>> GetAppointmentsWithPagination(int payload, int pageindex, string customername) {
            var query = _dbContext.Appointments.Include(a => a.Vehicle).ThenInclude(v => v.Category)
                .Include(a => a.AppointmentServices).ThenInclude(asv => asv.Service)
                .Include(a => a.Customer).ThenInclude(a => a.Account)
                .OrderBy(a => a.Id)
                .Select(a => new AppointmentViewModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    Services = a.AppointmentServices.Select(x => new Dtos.Service.ServiceViewFormModel
                    {
                        Id = x.ServiceId,
                        Name = x.Service.Name
                    }).ToList(),
                    Status = a.Status,
                    VehicleModel = a.Vehicle.Category.Name,
                    LicensePlate = a.Vehicle.LicensePlate,
                    AppointmentImages = a.AppointmentImages.Select(x => x.Image).ToList(),
                    CustomerName = a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name,
                    PhoneNumber = a.Customer.Account.Phone,

                }).Where(x => x.CustomerName.Contains(customername));

            return await PaginationHelper.PaginationAsync(query, payload, pageindex);

        }

        public async Task<AppointmentViewDetailModel> GetAppointmentWithDetails(int appointmentId) {
            return await _dbContext.Appointments.AsNoTracking()
                .Where(a => a.Id == appointmentId)
                .Include(a => a.Vehicle).ThenInclude(v => v.Category)
                .Include(a => a.Customer).ThenInclude(c => c.Account)
                .Include(a => a.Employee).ThenInclude(e => e.Account)
                .Include(a=>a.Order).ThenInclude(a=>a.TechnicianWorkingSessions).ThenInclude(tws=>tws.Technician).ThenInclude(t=>t.Employee).ThenInclude(e=>e.Account)
                .Include(a => a.AppointmentImages)
                .Include(a => a.AppointmentServices).ThenInclude(asv => asv.Service)
                .Select(a => new AppointmentViewDetailModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    Note = a.Note,
                    Status = a.Status,
                    VehicleId = a.VehicleId,
                    VehicleName = a.Vehicle.Category.Name,
                    VehiclePlateNumber = a.Vehicle.LicensePlate,
                    CustomerName = a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name,
                    CustomerEmail = a.Customer.Account.Email,
                    PhoneNumber = a.Customer.Account.Phone,
                    EmployeeName = a.Employee != null
                        ? a.Employee.Account.First_Name + " " + a.Employee.Account.Last_Name
                        : null,
                    OrderId = a.OrderId,
                    Services = a.AppointmentServices.Select(s => new ServiceViewFormModel
                    {
                        Id = s.ServiceId,
                        Name = s.Service.Name
                    }).ToList(),
                    ImagesUrls = a.AppointmentImages.Select(img => img.Image).ToList(),
                    Technicians = a.Order != null ? a.Order.TechnicianWorkingSessions.Select(tws => new TechnicianViewModel
                    {
                        Id = tws.TechnicianId,
                        ExpYears = tws.Technician.ExpYear,
                        FullName = tws.Technician.Employee.Account.First_Name + " " + tws.Technician.Employee.Account.Last_Name,
                        Phone = tws.Technician.Employee.Account.Phone,
                        Status = tws.Technician.Employee.Status,
                        Skills = tws.Technician.TechnicianSkills.Select(ts => new ServiceViewFormModel
                        {
                            Id = ts.ServiceId,
                            Name = ts.Service.Name
                        }).ToList()
                    }).ToList() : new List<TechnicianViewModel>()
                })
                .FirstOrDefaultAsync();
        }
        public async Task<int> GetCurrentSlotAsync() {
            var currSlot = await _dbSet.CountAsync(a => a.Status == AppointmentStatusEnum.InProgress);
            return currSlot;
        }
        public async Task<PageResultDto<Appointment>> GetAppointmentInDayWithPaginationAsync(DateTime date, int pageSize, int pageIndex) {
            var query = _dbContext.Appointments.Where(a => a.Appointment_Date.Date == date.Date && a.Status == AppointmentStatusEnum.Confirmed).AsQueryable();
            return await PaginationHelper.PaginationAsync(query, pageSize, pageIndex);
        }
        public async Task<Appointment> GetAppointmentByOrderIdAsync(int orderId) {
            var entity = await _dbContext.Appointments.FirstOrDefaultAsync(x => x.OrderId == orderId);
            if (entity is null) {
                throw new Exception($"Entity with orderId = {orderId} is not found.");
            }
            return entity;
        }
        public async Task<PageResultDto<Appointment>> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex) {
            var entity = _dbSet.Where(a => a.Appointment_Date.Date <= date.Date && a.Status == AppointmentStatusEnum.Confirmed).OrderBy(a => a.Appointment_Date).AsQueryable();
            return await PaginationHelper.PaginationAsync(entity, pageSize, pageIndex);
        }
        public async Task<Appointment> UpdateAppointmentDate(DateTime date, int appointmentId) {
            var appointment = await _dbSet.FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (appointment == null) {
                throw new Exception($"Appointment with id = {appointmentId} is not found.");
            }
            appointment.Appointment_Date = date;
            _dbContext.Update(appointment);
            await _dbContext.SaveChangesAsync();
            return appointment;
        }

        public async Task<CenterDailyCapacityModel> GetAppointmentWithDailyCount(int days, DateOnly today) {
            var center = await _dbContext.ServiceCenters.FirstOrDefaultAsync();
            var capacity = center.Capacity;
            var start = today.ToDateTime(TimeOnly.MinValue);
            var end = today.AddDays(days).ToDateTime(TimeOnly.MinValue);

            var grouped = await _dbContext.Appointments.AsNoTracking()
                .Where(a => a.Appointment_Date >= start && a.Appointment_Date < end)
                .GroupBy(a => DateOnly.FromDateTime(a.Appointment_Date)).
                 Select(g => new AppointmentDailyCountModel
                 {
                     Count = g.Count(),
                     Date = g.Key

                 }).ToListAsync();
            var map = grouped.ToDictionary(x => x.Date, x => x.Count);
            var filled = Enumerable.Range(0, days)
                .Select(day => today.AddDays(day))
                .Select(d => new AppointmentDailyCountModel
                {
                    Date = d,
                    Count = map.TryGetValue(d, out var count) ? count : 0
                }).ToList();


            return new CenterDailyCapacityModel
            {
                Capacity = capacity,
                AppointmentDailyCountModels = filled
            };

        }

        public async Task CancelAppointment() {
            var today = DateOnly.FromDateTime(DateTime.Now);
            await _dbContext.Appointments
                .Where(a =>
                (DateOnly.FromDateTime(a.Appointment_Date) < today && (a.Status == AppointmentStatusEnum.Pending || a.Status == AppointmentStatusEnum.Confirmed)) ||
                 DateOnly.FromDateTime(a.Create_At) < today && a.Status == AppointmentStatusEnum.Pending
                )
                .ExecuteUpdateAsync(s => s
                .SetProperty(x => x.Status, AppointmentStatusEnum.Canceled)
                );

        }

        //public async Task<PageResultDto<AppointmentViewModel>> GetWithPaginationAsync(AppointmentQueryDto model)
        //{
        //    var query = _dbSet
        //        .AsNoTracking()
        //         .Where(a =>
        //            (string.IsNullOrEmpty(model.CustomerName)
        //             || (a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name)
        //                    .Contains(model.CustomerName))
        //            && (!model.Status.HasValue || a.Status == model.Status.Value)
        //            && (!model.BeginTime.HasValue || DateOnly.FromDateTime(a.Appointment_Date) >= model.BeginTime.Value)
        //            && (!model.EndTime.HasValue || DateOnly.FromDateTime(a.Appointment_Date) <= model.EndTime.Value)
        //        )
        //        .Select(a => new AppointmentViewModel
        //        {
        //           Id = a.Id,
        //           Services = a.AppointmentServices.Select(x=>new ServiceViewFormModel
        //           {
        //               Id = x.ServiceId,
        //                  Name = x.Service.Name
        //           }).ToList(),
        //             AppointmentDate = a.Appointment_Date,
        //                Status = a.Status,
        //                VehicleModel = a.Vehicle.Category.Name,
        //                LicensePlate = a.Vehicle.LicensePlate,
        //                AppointmentImages = a.AppointmentImages.Select(x => x.Image).ToList(),
        //                CustomerName = a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name,
        //                PhoneNumber = a.Customer.Account.Phone,
        //                OrderId = a.OrderId,
        //                Note = a.Note,
        //                Technicians = a.Order.TechnicianWorkingSessions
        //                                .Select(t => new TechnicianViewModel
        //                                {
        //                                    Id = t.TechnicianId,
        //                                    ExpYears = t.Technician.ExpYear,
        //                                    FullName = t.Technician.Employee.Account.First_Name + " " + t.Technician.Employee.Account.Last_Name,
        //                                    Phone = t.Technician.Employee.Account.Phone,
        //                                    Skills = t.Technician.TechnicianSkills
        //                                                .Select(ts => new ServiceViewFormModel
        //                                                {
        //                                                    Id = ts.ServiceId,
        //                                                    Name = ts.Service.Name
        //                                                })
        //                                                .ToList(),
        //                                    Status = t.Technician.Employee.Status
        //                                }).ToList()


        //        }).Where(x => x.CustomerName.Contains(model.CustomerName));



        //    query = query.ApplySorting(model.SortField, model.SortOrder);
        //    return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);

        //}
        public async Task<PageResultDto<AppointmentViewModel>> GetWithPaginationAsync(AppointmentQueryDto model) {
            var baseQuery = _dbSet
                         .AsNoTracking()
                         .Include(a => a.Customer).ThenInclude(a => a.Account)
                         .Where(a =>
                             (string.IsNullOrEmpty(model.KeyWord)
                                 || (a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name).Contains(model.KeyWord)
                                 || (a.Customer.Account.Phone != null && a.Customer.Account.Phone.Contains(model.KeyWord))
                             )
                             && (!model.Status.HasValue || a.Status == model.Status.Value)
                             && (!model.BeginTime.HasValue || DateOnly.FromDateTime(a.Appointment_Date) >= model.BeginTime.Value)
                             && (!model.EndTime.HasValue || DateOnly.FromDateTime(a.Appointment_Date) <= model.EndTime.Value)
                         );


            baseQuery = baseQuery.ApplySorting(model.SortField, model.SortOrder);
            var pagedResult = await PaginationHelper.PaginationAsync(
                                              baseQuery.Select(a => new
                                              {
                                                  a.Id
                                              }),
                                              model.PageSize.Value,
                                              model.PageIndex.Value
                                                );
            if (!pagedResult.Items.Any())
                return new PageResultDto<AppointmentViewModel>(new List<AppointmentViewModel>(), 0, model.PageSize.Value, model.PageIndex.Value);

            var appointmentIds = pagedResult.Items.Select(x => x.Id).ToList();
            var appointments = await _dbSet
                .AsNoTracking()
                 .Include(a => a.Vehicle)
                .Include(a => a.Customer).ThenInclude(c => c.Account)
                .Include(a => a.AppointmentServices).ThenInclude(asv => asv.Service)
                .Include(a => a.AppointmentImages)
                .Include(a => a.Order)
                    .ThenInclude(order => order.TechnicianWorkingSessions)
                        .ThenInclude(tws => tws.Technician)
                            .ThenInclude(t => t.Employee)
                                .ThenInclude(e => e.Account)
  
                .Include(a => a.Order)
                    .ThenInclude(order => order.TechnicianWorkingSessions)
                        .ThenInclude(tws => tws.Technician)
                            .ThenInclude(t => t.TechnicianSkills)
                                .ThenInclude(ts => ts.Service)
                .Where(a => appointmentIds.Contains(a.Id))
                .Select(a => new AppointmentViewModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    Status = a.Status,
                    VehicleModel = a.Vehicle.Category.Name,
                    LicensePlate = a.Vehicle.LicensePlate,
                    Note = a.Note,
                    OrderId = a.OrderId,
                    CustomerName = a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name,
                    PhoneNumber = a.Customer.Account.Phone,

                    Services = a.AppointmentServices.Select(s => new ServiceViewFormModel
                    {
                        Id = s.ServiceId,
                        Name = s.Service.Name
                    }).ToList(),

                    AppointmentImages = a.AppointmentImages.Select(i => i.Image).ToList(),

                    Technicians = a.Order.TechnicianWorkingSessions.Select(tws => new TechnicianViewModel
                    {
                        Id = tws.TechnicianId,
                        ExpYears = tws.Technician.ExpYear,
                        FullName = tws.Technician.Employee.Account.First_Name + " " + tws.Technician.Employee.Account.Last_Name,
                        Phone = tws.Technician.Employee.Account.Phone,
                        Status = tws.Technician.Employee.Status,
                        Skills = tws.Technician.TechnicianSkills.Select(ts => new ServiceViewFormModel
                        {
                            Id = ts.ServiceId,
                            Name = ts.Service.Name
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();


            var orderedAppointments = appointmentIds
                .Select(id => appointments.FirstOrDefault(a => a.Id == id))
                .Where(a => a != null)
    
                .ToList();


            return new PageResultDto<AppointmentViewModel>(
                orderedAppointments,
                pagedResult.TotalItems,
                model.PageSize.Value,
                model.PageIndex.Value
            );
        }

        public async Task<PageResultDto<AppointmentTechnicianViewModel>> GetAppointmentTechnicianViewModelByTechnicianId(int technicianId, AppointmentTechnicianQueryDto model)
        {
            var start = model.BeginTime?.ToDateTime(TimeOnly.MinValue);
            var end = model.EndTime?.ToDateTime(TimeOnly.MaxValue);
            var query = _dbContext.TechnicianWorkingSessions
                .AsNoTracking()
                .Include(t=>t.Order).ThenInclude(o=>o.Appointment)
                .Where(tws => tws.TechnicianId == technicianId
                    && (!model.Status.HasValue || tws.Status == model.Status.Value)
                    && (!start.HasValue || tws.Order.Appointment.Appointment_Date >= start.Value)
                    && (!end.HasValue || tws.Order.Appointment.Appointment_Date <= end.Value)
                    && (!model.Status.HasValue || tws.Status == model.Status.Value)
                ).Select(x => new
                {
                    x.OrderId,
                    x.Order.Appointment.Appointment_Date
                });

            query = query.ApplySorting(model.SortField, model.SortOrder);
            var pagedResult = await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
            if (!pagedResult.Items.Any())
                return new PageResultDto<AppointmentTechnicianViewModel>(new List<AppointmentTechnicianViewModel>(), 0, model.PageSize.Value, model.PageIndex.Value);
            var orderIds = pagedResult.Items.Select(x => x.OrderId).ToList();
            var appointments = await _dbContext.Appointments
                .AsNoTracking()
                
                .Where(a => orderIds.Contains(a.OrderId.Value))
                 .Include(a => a.Vehicle)
                    .ThenInclude(v => v.Category)
                .Include(a => a.Customer)
                    .ThenInclude(c => c.Account)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(asv => asv.Service)
                .Include(a => a.AppointmentImages)
                .Include(a => a.Order)
                    .ThenInclude(o => o.OrderParts)
                        .ThenInclude(op => op.Part)
                .Include(a => a.Order)
                    .ThenInclude(o => o.TechnicianWorkingSessions)
                        .ThenInclude(tws => tws.Technician)
                            .ThenInclude(t => t.Employee)
                                .ThenInclude(e => e.Account)
                .Include(a => a.Order)
                    .ThenInclude(o => o.TechnicianWorkingSessions)
                        .ThenInclude(tws => tws.Technician)
                            .ThenInclude(t => t.TechnicianSkills)
                                .ThenInclude(ts => ts.Service)
                .Select(a => new AppointmentTechnicianViewModel
                {
                    Id = a.Id,
                    AppointmentDate = a.Appointment_Date,
                    VehicleModel = a.Vehicle.Category.Name,
                    LicensePlate = a.Vehicle.LicensePlate,
                    CustomerName = a.Customer.Account.First_Name + " " + a.Customer.Account.Last_Name,
                    PhoneNumber = a.Customer.Account.Phone,
                    Services = a.AppointmentServices.Select(s => s.Service.Name).ToList(),
                    OrderId = a.OrderId,
                    Parts = a.Order.OrderParts.Select(op => new PartTechnicianViewModel
                    {
                        Name = op.Part.Name,
                        Quantity = op.Quantity,
                        ImageUrl = op.Part.Image,
                        Price = op.Price,
                        ReplacementPrice = op.ReplacementPrice,
                        Stock = op.Part.Stock,
                        Id = op.PartId,

                    }).ToList(),
                    Status = a.Order.TechnicianWorkingSessions
                                .FirstOrDefault(tws => tws.TechnicianId == technicianId).Status,
                    AppointmentImages = a.AppointmentImages.Select(img => img.Image)
                })
                .ToListAsync();

            var orderedAppointments = orderIds.Select(id=> appointments.FirstOrDefault(a => a.OrderId == id))
                .Where(a => a != null)
                .ToList();
            return new PageResultDto<AppointmentTechnicianViewModel>(orderedAppointments, pagedResult.TotalItems, model.PageSize.Value, model.PageIndex.Value);


        }

        public async Task<int> CountAppointment(DateOnly appointment_Date)
        {
            return await _dbSet.CountAsync(x => DateOnly.FromDateTime(x.Appointment_Date) == appointment_Date);
        }

        public async Task<PaymentPendingPickupEmailModel> GetPaymentPendingPickupEmailModel(int id)
        {
            var center = await _dbContext.ServiceCenters.FirstOrDefaultAsync();
            return await _dbContext.Appointments.AsNoTracking()
                .Where(x => x.Id == id)
                .Include(x => x.Customer).ThenInclude(x => x.Account)
                .Include(x => x.AppointmentServices).ThenInclude(x => x.Service)
                .Include(x => x.Vehicle).ThenInclude(x => x.Category)
                .Include(x => x.Order).ThenInclude(x => x.OrderParts)
                .Select(x => new PaymentPendingPickupEmailModel
                {
                    Amount = x.Order.OrderParts.Sum(x => (x.Price + x.ReplacementPrice) * x.Quantity) * (1 + center.Vat / 100m),
                    CloseDate = center.WorkEndDay,
                    CloseTime = center.CloseTime,
                    CompletedAt = DateTime.Now,
                    CustomerName = x.Customer.Account.First_Name + " " + x.Customer.Account.Last_Name,
                    Email = x.Customer.Account.Email,
                    LicensePlate = x.Vehicle.LicensePlate,
                    OpenDate = center.WorkStartDay,
                    OpenTime = center.OpenTime,
                    ServiceCenterName = center.Name,
                    ServiceList = x.AppointmentServices.Select(x => x.Service.Name).ToList(),
                    VehicleModel = x.Vehicle.Category.Name
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> CheckAllReadyForPickup(int vehicleId)
        {
            var anyReadyForPickUp = await _dbContext.Appointments
                 .Where(x => x.VehicleId == vehicleId && (x.Status != AppointmentStatusEnum.Done && x.Status != AppointmentStatusEnum.Canceled))
                 .AllAsync(x => x.Status == AppointmentStatusEnum.ReadyForPickup);
            return anyReadyForPickUp;
        }

        public async Task<IEnumerable<int>> GetAppointmentReadyForPickUpByVehicleId(int vehicleId)
        {
            return await _dbContext.Appointments
                .Where(x => x.VehicleId == vehicleId && x.Status == AppointmentStatusEnum.ReadyForPickup)
                .Select(x => x.Id)
                .ToListAsync();
        }
        public async Task<PageResultDto<AppointmentInProgressUnderstaffedViewModel>> GetUnderstaffedInProgressAsync(AppointmentQueryDto model)
        {
            var query = _dbContext.Appointments.AsNoTracking()
                .Where(x => x.Status == AppointmentStatusEnum.InProgress)
                .Select(x => new AppointmentInProgressUnderstaffedViewModel
                {
                    AppointmentDate = x.Appointment_Date,
                    CustomerName = x.Customer.Account.First_Name + " " + x.Customer.Account.First_Name,
                    CustomerPhone = x.Customer.Account.Phone,
                    Id = x.Id,
                    CustomerEmail = x.Customer.Account.Email,
                    Services = x.AppointmentServices.Select(s => new ServiceViewFormModel
                    {
                        Id = s.ServiceId,
                        Name = s.Service.Name
                    }).ToList(),
                    VehicleName = x.Vehicle.Category.Name,
                    VehiclePlateNumber = x.Vehicle.LicensePlate,
                    Technicians = x.Order.TechnicianWorkingSessions
                                .Select(t => new TechnicianViewModel
                                {
                                    Id = t.TechnicianId,
                                    ExpYears = t.Technician.ExpYear,
                                    FullName = t.Technician.Employee.Account.First_Name + " " + t.Technician.Employee.Account.Last_Name,
                                    Phone = t.Technician.Employee.Account.Phone,
                                    Skills = t.Technician.TechnicianSkills
                                                .Select(ts => new ServiceViewFormModel
                                                {
                                                    Id = ts.ServiceId,
                                                    Name = ts.Service.Name
                                                })
                                                .ToList(),
                                    Status = t.Technician.Employee.Status
                                }).ToList()

                })
                .Where(x => x.Technicians.Any(x => x.Status == EmployeeStatusEnum.OnLeave))
                .ApplySorting(model.SortField, model.SortOrder)
                ;
            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
        }

        public async Task<int> CountAppointmentsInMonth(int year, int month)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1);
            return await _dbContext
                .Appointments
                .CountAsync(a => a.Appointment_Date >= startDate
                && a.Appointment_Date <= endDate
                && a.Status != Enums.AppointmentStatusEnum.Canceled
                && a.Status != Enums.AppointmentStatusEnum.Pending);
        }

        public async Task<int> CountCustomersInMonth(int year, int month)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1);
            return await _dbContext
            .Appointments
            .Where(a => a.Status != AppointmentStatusEnum.Pending
            && a.Status != AppointmentStatusEnum.Canceled
            && a.Appointment_Date >= startDate
            && a.Appointment_Date <= endDate)
            .GroupBy(a => a.CustomerId)
            .CountAsync();
        }

        public async Task<int> CountAppointmentsInMonthWithStatus(int year, int month, AppointmentStatusEnum status)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1);
            return await _dbContext
                .Appointments
                .CountAsync(a => a.Appointment_Date >= startDate
                && a.Appointment_Date <= endDate
                && a.Status == status);
        }

        public async Task<Appointment> GetByOrderIdAsync(int orderId) {
            return await _dbSet.FirstOrDefaultAsync(a => a.OrderId == orderId);
        }

        public async Task<AppointmentVehicleViewModel> GetVehicleByAppointmentId(int appointmentId) {
            var parts = await _dbContext.AppointmentPartConditions
                .AsNoTracking()
                .Where(apc => apc.AppointmentId == appointmentId)
                .Include(apc => apc.Part).ThenInclude(p => p.Category)
                .GroupBy(apc => apc.Part.Category.Name)
                .Select(apc => new PartCategoryAppointmentViewModel
                {
                        PartCategoryName = apc.Key,
                         DamagedPartViewModels = apc
                       .GroupBy(apc2 => apc2.PartId)
                       .Select(g => g
                        .OrderByDescending(x => x.Level)
                        .Select(x => new DamagedPartViewModel
                        {
                            DamageLevel = x.Level,
                            Id = x.PartId,
                            PartName = x.Part.Name,
                            PartCategoryId = x.Part.CategoryId,
                            NodeName = x.Part.Name.Replace(" ","_")
                        })
                        .FirstOrDefault()
                        ).ToList()
                }).ToListAsync();

            return await _dbSet.Where(x => x.Id == appointmentId)
                .Include(x => x.Vehicle).ThenInclude(v => v.Category)
                .Include(x=>x.AppointmentPartConditions)
                .Select(x => new AppointmentVehicleViewModel
                {
                    Id = x.Id,
                    VehicleCategoryId = x.Vehicle.CategoryId,
                    VehicleModel3DUrl = x.Vehicle.Category.Model3DUrl,
                    PartCategoryAppointmentViewModels = parts,
                    Scale = new Dtos.Others.ScaleDto { 
                        
                        X = x.Vehicle.Category.ScaleX,
                        Y = x.Vehicle.Category.ScaleY,  
                        Z = x.Vehicle.Category.ScaleZ
                    
                    }


                }).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ServiceSummaryViewModel>> GetTopServicesAsync(ServiceSummaryQueryDto model) {
            var query = _dbContext.AppointmentServices
                .AsNoTracking()
                .Include(asv => asv.Service)
                .Include(asv => asv.Appointment)
                .AsQueryable();
            if (model.FromDate.HasValue) {

                query = query.Where(asv => DateOnly.FromDateTime(asv.Appointment.Appointment_Date) >= model.FromDate);
            }
            if (model.ToDate.HasValue) {
                query = query.Where(asv => DateOnly.FromDateTime(asv.Appointment.Appointment_Date) <= model.ToDate);
            }
            var grouped = query
               .GroupBy(asv => new { asv.ServiceId, asv.Service.Name })
               .Select(g => new ServiceSummaryViewModel
               {
                   ServiceID = g.Key.ServiceId,
                   ServiceName = g.Key.Name,
                   TotalAppointments = g.Count()
               })
             .OrderByDescending(s => s.TotalAppointments);

            if (model.Top.HasValue) {
                var limited = grouped.Take(model.Top.Value);
                return await limited.ToListAsync();
            }
            return await grouped.ToListAsync();
        }

        public async Task<bool> CheckInValidVehicleID(int vehicleId) {
            return await _dbContext.Appointments
                .Where(a => a.VehicleId == vehicleId)
                .AnyAsync(a => a.Status != AppointmentStatusEnum.Done && a.Status != AppointmentStatusEnum.Canceled);
        }
    }
}
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Appointment;
using DataAccess.Dtos.CenterCare;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IServiceCenterRepository _serviceCenterRepository;
        private readonly IMapper _mapper;
        public AppointmentService(IAppointmentRepository appointmentRepository, IMapper mapper, IServiceCenterRepository serviceCenterRepository)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
            _serviceCenterRepository = serviceCenterRepository;
        }

        public async Task<int> CreateAppointment(AppointmentCreateModel model)
        {

            var currentDay = model.Appointment_Date.DayOfWeek;
            var serviceCenter = await _serviceCenterRepository.GetCenterInforAsync();
            if (currentDay < serviceCenter.WorkStartDay || currentDay > serviceCenter.WorkEndDay)
            {
                throw new Exception($"You must book the appointment from {serviceCenter.WorkStartDay} to {serviceCenter.WorkEndDay} ");
            }


            if ((await CheckCustomerCreate(model.CustomerId)) == false)
            {
                throw new Exception("You’ve reached your booking limit.");

            }
            if ((await CheckAppointmentsForApointmentDate(model.Appointment_Date)) == false)
            {
                throw new Exception("This day is fully booked");
            }
            var appointment = _mapper.Map<Appointment>(model);
            await _appointmentRepository.AddAsync(appointment);

            return appointment.Id;

        }

        private async Task<bool> CheckAppointmentsForApointmentDate(DateTime appointment_Date)
        {
            int cnt = await _appointmentRepository.CountAppointment(DateOnly.FromDateTime(appointment_Date));
            int capacity = await _serviceCenterRepository.GetAppactityOfServiceCenter();
            if (cnt > capacity)
            {
                return false;

            }
            return true;

        }

        private async Task<bool> CheckCustomerCreate(int customerId)
        {
            int appointments = await _appointmentRepository.CountAppointmentsPerDay(customerId);
            int dailyLimit = await _serviceCenterRepository.GetLimitBookingOfServiceCenter();
            if (appointments > dailyLimit)
            {

                return false;
            }
            return true;
        }
        public async Task<int> UpdateAppointmentStatus(AppointmentUpdateDto data)
        {
            try
            {
               

                await _appointmentRepository.UpdateAppointmentStatusAsync(data.appointmentID, data.status);
                return data.appointmentID;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, DateOnly currentDate, int pageSize, int pageIndex)
        {
            var data = await _appointmentRepository.GetAppointmentByEmployeeIDAsync(employeeID, status, currentDate, pageSize, pageIndex);
            return new PageResultDto<AppointmentViewDto>
            {
                Items = _mapper.Map<IEnumerable<AppointmentViewDto>>(data.Items),
                TotalItems = data.TotalItems,
                TotalPages = data.TotalPages,
                PageIndex = pageIndex,
                PageSize = pageSize
            };
        }
        public async Task<PageResultDto<AppointmentViewDto>> GetAppointmentByEmployeeIDAsync(int employeeID, AppointmentStatusEnum status, int pageSize, int pageIndex)
        {
            var data = await _appointmentRepository.GetAppointmentByEmployeeIDAsync(employeeID, status, pageSize, pageIndex);
            return new PageResultDto<AppointmentViewDto>
            {
                Items = _mapper.Map<IEnumerable<AppointmentViewDto>>(data.Items),
                TotalPages = data.TotalPages,
                PageIndex = pageIndex,
                PageSize = data.PageSize,
                TotalItems = data.TotalItems

            };

        }
        public async Task<bool> DeleteAppointment(int appointmentId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            if (appointment == null)
            {
                throw new Exception("Appointment not found");
            }
            appointment.Status = DataAccess.Enums.AppointmentStatusEnum.Canceled;
            await _appointmentRepository.UpdateAsync(appointment);
            return true;
        }
        public async Task<AppointmentViewDetailModel> GetAppointmentByiD(int appointmentIdId)
        {
            try
            {
                var result = await _appointmentRepository.GetAppointmentWithDetails(appointmentIdId);
                if (result == null) throw new Exception("Appointment not found");
                return result;

            }
            catch
            {
                throw new Exception("Appointment not found");
            }
        }
        public async Task<IEnumerable<AppointmentViewModel>> GetAppointmentHistoryByCustomerId(int customerId)
        {
            try
            {
                var result = await _appointmentRepository.GetAppointmentsByCustomerId(customerId);
                return result;

            }
            catch (Exception e)
            {

                throw new Exception("Error retrieving appointment history");
            }

        }
        public async Task<PageResultDto<AppointmentViewModel>> GetAppointmentsWithPagination(int? payload, int? pageindex, string? customerName)
        {
            try
            {
                int pageSize = payload ?? 10;
                int pageIndex = pageindex ?? 1;
                string customername = customerName ?? "";
                return await _appointmentRepository.GetAppointmentsWithPagination(pageSize, pageIndex, customername);

            }
            catch (Exception e)
            {
                throw new Exception("Error retrieving appointments with pagination");
            }
        }
        public async Task<bool> UpdateAppointment(AppointmentUpdateModel model, int employeeId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(model.AppointmentId);

            if (appointment == null)
            {
                throw new Exception("Appointment not found");
            }
           
            if (appointment.Status == AppointmentStatusEnum.Done || appointment.Status == AppointmentStatusEnum.Canceled)
            {
                throw new Exception("Cannot update status of completed or canceled appointment");
            }
            if (model.Status == AppointmentStatusEnum.CheckedIn)
            {
                var utcNow = DateTime.UtcNow;
                var vnZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                var vnTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vnZone);
                if (DateOnly.FromDateTime(appointment.Appointment_Date) != DateOnly.FromDateTime(vnTime))
                {
                    throw new Exception("Can only check-in on the day of the appointment");
                }

            }
            _mapper.Map(model, appointment);
            if(appointment.Employee == null) appointment.EmployeeId = employeeId;
            await _appointmentRepository.UpdateAsync(appointment);
            return true;

        }
        public async Task<ResponseDto<PageResultDto<AppointmentViewDto>>> GetAppointmentInCurrentDay(int pageSize, int pageIndex)
        {
            var currentDay = DateTime.UtcNow;
            var data = await _appointmentRepository.GetAppointmentInDayWithPaginationAsync(currentDay, pageSize, pageIndex);
            var appointmentDtos = _mapper.Map<IEnumerable<AppointmentViewDto>>(data.Items);
            var pageResult = new PageResultDto<AppointmentViewDto>
            {
                Items = appointmentDtos,
                PageIndex = data.PageIndex,
                PageSize = data.PageSize,
                TotalItems = data.TotalItems,
                TotalPages = data.TotalPages
            };
            return new ResponseDto<PageResultDto<AppointmentViewDto>>
            {
                statusCode = HttpStatus.OK,
                message = Message.APPOINTMENTS_FETCHED_SUCCESS,
                data = pageResult
            };
        }
        public async Task<ResponseDto<PageResultDto<AppointmentViewDto>>> GetAppointmentBeforeDayAsync(DateTime date, int pageSize, int pageIndex)
        {
            var data = await _appointmentRepository.GetAppointmentBeforeDayAsync(date, pageSize, pageIndex);
            var appointmentDtos = _mapper.Map<IEnumerable<AppointmentViewDto>>(data.Items);
            var pageResult = new PageResultDto<AppointmentViewDto>
            {
                Items = appointmentDtos,
                PageIndex = data.PageIndex,
                PageSize = data.PageSize,
                TotalItems = data.TotalItems,
                TotalPages = data.TotalPages
            };
            return new ResponseDto<PageResultDto<AppointmentViewDto>>
            {
                statusCode = HttpStatus.OK,
                message = Message.APPOINTMENTS_FETCHED_SUCCESS,
                data = pageResult
            };
        }
        public async Task<ResponseDto<AppointmentViewDto>> UpdateAppointmentDateAsync(DateTime date, int appointmentId)
        {
            var res = await _appointmentRepository.UpdateAppointmentDate(date, appointmentId);
            var appointmentDto = _mapper.Map<AppointmentViewDto>(res);
            return new ResponseDto<AppointmentViewDto>
            {
                statusCode = HttpStatus.OK,
                message = Message.APPOINTMENT_UPDATED_SUCCESS,
                data = appointmentDto
            };
        }

        public async Task<AppointmentInforToSentDto> GetAppointmentInforToAsync(int appointmentId)
        {
            try
            {
                var result = await _appointmentRepository.GetAppointmentWithDetails(appointmentId);
                if (result == null) throw new Exception("Appointment not found");
                return _mapper.Map<AppointmentInforToSentDto>(result);

            }
            catch
            {
                throw new Exception("Appointment not found");
            }
        }

        public async Task<CenterDailyCapacityModel> GetAppointmentWithCountDaily()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            return await _appointmentRepository.GetAppointmentWithDailyCount(30, today);
        }

        public async Task<PageResultDto<AppointmentViewModel>> GetAppointmentsWithPagination(AppointmentQueryDto model)
        {
            return await _appointmentRepository.GetWithPaginationAsync(model);
        }

        public async Task<PageResultDto<AppointmentTechnicianViewModel>> GetAppointmentByTechnicianId(int technicianId, AppointmentTechnicianQueryDto model)
        {
            return await _appointmentRepository.GetAppointmentTechnicianViewModelByTechnicianId(technicianId, model);
        }
        public async Task<int> CountAppointmentsInMonths(int year, int month)
        {
            return await _appointmentRepository.CountAppointmentsInMonth(year, month);
        }
        public async Task<int> CountCustomersInMonths(int year, int month)
        {
            return await _appointmentRepository.CountCustomersInMonth(year, month);
        }
        public async Task<int> CountAppointmentsInMonthsWithStatus(int year, int month, AppointmentStatusEnum status)
        {
            return await _appointmentRepository.CountAppointmentsInMonthWithStatus(year, month, status);
        }

        public async Task<PageResultDto<AppointmentInProgressUnderstaffedViewModel>> GetUnderstaffedInProgressAsync(AppointmentQueryDto model)
        {
           return await _appointmentRepository.GetUnderstaffedInProgressAsync(model);
        }
    }
}
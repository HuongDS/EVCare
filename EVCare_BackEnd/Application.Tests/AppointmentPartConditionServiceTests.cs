using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Services;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.AppointmentPartCondition;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Moq;

namespace Application.Tests {
    public class AppointmentPartConditionServiceTests {
        private readonly IFixture _fixture;
        public AppointmentPartConditionServiceTests() {

            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Theory, AutoData]
        public async Task CreateAppointmentPartConditionAsync_WithValidData_AddSuccessFully(
            AppointmentPartConditionCreateModel dto, int technicianId) {

            var uowMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            uowMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());
            var appointmentPartConditionRepository = _fixture.Freeze<Mock<IAppointmentPartConditionRepository>>();
            appointmentPartConditionRepository.Setup(t =>
            t.CreateAppointmentPartConditionAsync(It.IsAny<AppointmentPartCondition>())).Returns(Task.CompletedTask);

            dto.PartDamageLevels = new List<AppointmentPartDamageLevelCreateModel>
            {
                new AppointmentPartDamageLevelCreateModel()
                {
                    PartId = 1,
                    LevelEnum = DataAccess.Enums.DamageLevelEnum.Moderate
                },
                 new AppointmentPartDamageLevelCreateModel()
                {
                    PartId = 2,
                    LevelEnum = DataAccess.Enums.DamageLevelEnum.Severe
                }
            };

            var appointmentPartContitionService = _fixture.Create<AppointmentPartConditionService>();

            await appointmentPartContitionService.CreateAppointmentPartConditionAsync(dto, technicianId);
            appointmentPartConditionRepository.Verify(t =>
            t.CreateAppointmentPartConditionAsync(It.IsAny<AppointmentPartCondition>()), Times.Exactly(2));




        }

        [Theory,AutoData]
        public async Task UpdateAppointmentPartConditionAsync_WithValidData_UpdateSuccessfully(
            AppointmentPartConditionCreateModel dto, int technicianId) {
            var uowMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            uowMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());
            var appointmentPartConditionRepository = _fixture.Freeze<Mock<IAppointmentPartConditionRepository>>();
            appointmentPartConditionRepository.Setup(t =>
            t.CreateAppointmentPartConditionAsync(It.IsAny<AppointmentPartCondition>())).Returns(Task.CompletedTask);

            appointmentPartConditionRepository.Setup(t=>
            t.DeleteAppointmentPartConditionsByAppointmentIdAsync(It.IsAny<int>(),It.IsAny<int>())
            ).Returns(Task.CompletedTask);

            dto.PartDamageLevels = new List<AppointmentPartDamageLevelCreateModel>
            {
                new AppointmentPartDamageLevelCreateModel()
                {
                    PartId = 1,
                    LevelEnum = DataAccess.Enums.DamageLevelEnum.Moderate
                },
                 new AppointmentPartDamageLevelCreateModel()
                {
                    PartId = 2,
                    LevelEnum = DataAccess.Enums.DamageLevelEnum.Severe
                },
                  new AppointmentPartDamageLevelCreateModel()
                {
                    PartId = 3,
                    LevelEnum = DataAccess.Enums.DamageLevelEnum.Severe
                }
            };
            var appointmentPartContitionService = _fixture.Create<AppointmentPartConditionService>();

            await appointmentPartContitionService.UpdateAppointmentPartConditionAsync(dto, technicianId);
            appointmentPartConditionRepository.Verify(t =>
            t.CreateAppointmentPartConditionAsync(It.IsAny<AppointmentPartCondition>()), Times.Exactly(3));



        }



    }
}

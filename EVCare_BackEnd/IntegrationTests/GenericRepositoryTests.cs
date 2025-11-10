using DataAccess;
using DataAccess.Entities;
using DataAccess.Repositories;

namespace IntegrationTests {
    public class GenericRepositoryTests : IClassFixture<DataBaseFixture> {
        private readonly DataBaseFixture _fixture;

        public GenericRepositoryTests(DataBaseFixture fixture) {
            _fixture = fixture;
        }
        [Fact]
        public async Task GetAllAsync_WithNoEntityId_GetAll() {


            var context = _fixture.CreateContext();
            var repo = new GenericRepository<Vehicle>(context);

            context.Vehicles.Add(new Vehicle { Id = 1, LicensePlate = "ABC123" });
            context.Vehicles.Add(new Vehicle { Id = 2, LicensePlate = "XYZ999" });
            await context.SaveChangesAsync();

        
            var result = await repo.GetAllAsync();

           
            Assert.Equal(2, result.Count());

        }
    }
}
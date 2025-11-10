using DataAccess;
using DataAccess.Entities;
using DataAccess.Repositories;

namespace IntegrationTests {
    public class GenericRepositoryTests : IClassFixture<DataBaseFixture> {
        private readonly DataBaseFixture _fixture;
        private readonly GenericRepository<Vehicle> _repository;
        public GenericRepositoryTests(DataBaseFixture fixture) {
            _fixture = fixture;
            _repository = new GenericRepository<Vehicle>(_fixture.CreateContext());
        }
        [Fact]
        public async Task GetAllAsync_WithNoEntityId_GetAll() {

            var result = await _repository.GetAllAsync();
            Assert.Equal(1, result.Count());

        }
    }
}
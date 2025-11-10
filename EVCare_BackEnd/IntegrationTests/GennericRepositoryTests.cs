using DataAccess;

namespace IntegrationTests {
    public class GennericRepositoryTests : IClassFixture<DataBaseFixture> {
        private EVCareDbContext _dbContext;


        public GennericRepositoryTests(DataBaseFixture dataBase) {
            _dbContext = dataBase.CreateContext();
        }
        [Fact]
        public void Test1() {

        }
    }
}
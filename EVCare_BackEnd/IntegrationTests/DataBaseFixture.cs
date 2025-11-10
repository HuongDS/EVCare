using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
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

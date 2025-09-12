using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Interfaces;

namespace DataAccess.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : IEntity
    {

    }
}

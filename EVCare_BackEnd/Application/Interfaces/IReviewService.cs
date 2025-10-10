using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Review;

namespace Application.Interfaces
{
    public interface IReviewService
    {
        Task<int> CreateAsync(ReviewCreateModel model);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Part {
    public class PartImportResult {
        public List<PartImportErrorModel> Errors { get; set; } = new();
        public bool HasError => Errors.Any();
    }
}

using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class FoulsByUser : FoulsBySeason
    {
        public BaseUser User { get; set; }
    }

}

using Sabio.Models.Domain.Seasons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class FoulsBySeason
    {
        public Season Season { get; set; }
        public int ConferenceId { get; set; }
        public int Total { get; set; }
    }
}

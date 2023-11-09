using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class TeamFoulCount
    {
        public int HomeTeam { get; set; }
        public decimal HomeTeamPercentage { get; set; }
        public int VisitingTeam { get; set; }
        public decimal VisitingTeamPercentage { get; set; }
    }

}

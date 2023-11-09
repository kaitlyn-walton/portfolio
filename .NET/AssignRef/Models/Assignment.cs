using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Users;

namespace Sabio.Models.Domain
{
    public class Assignment
    {
        public int Id { get; set; }
        public LookUp AssignmentType { get; set; }
        public LookUp3Col Position { get; set; }
        public  User User { get; set; }
        public decimal Fee { get; set; }
        public LookUp AssignmentStatus { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set;}
    }
}

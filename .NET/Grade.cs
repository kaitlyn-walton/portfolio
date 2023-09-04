﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Grades
{
    public class Grade
    {
        public int Id { get; set; }
        public int FoulId { get; set; }
        public string Comment { get; set; }
        public BaseUser CreatedBy { get; set; }
        public BaseUser ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public LookUp StatusType { get; set; }
        public GradeType GradeType { get; set; }
    }
}

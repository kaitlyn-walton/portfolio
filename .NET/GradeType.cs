using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Grades
{
    public class GradeType : LookUp3Col
    {        
        public bool IsReplay { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Grades
{
    public class GradeAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int FoulId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int GradeTypeId { get; set; }
        [AllowNull]
        [StringLength(1000)]
        public string Comment { get; set; }
    }
}

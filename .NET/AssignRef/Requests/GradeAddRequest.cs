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

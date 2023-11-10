    public class GradeUpdateRequest : GradeAddRequest, IModelIdentifier
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int StatusId { get; set; }

    }

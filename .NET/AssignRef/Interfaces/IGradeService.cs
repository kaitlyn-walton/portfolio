    public interface IGradeService
    {
        int AddGrade(GradeAddRequest model, int userId);
        void UpdateGrade(GradeUpdateRequest model, int userId);
        void ReplayGradeDeleteById(int id);
        void SoftDeleteGrade(int id, int userId);
        Paged<Grade> SelectByFoul(int pageIndex, int pageSize, int foulId);
        List<int> BatchInsertGrades(List<GradeAddRequest> model, int userId);
        List<int> AddBatchReplayGrade(List<ReplayEntryGradeAddRequest> model, int userId);
        void BatchUpdateReplayGrades(List<ReplayEntryGradeUpdateRequest> model, int userId);
        void BatchUpdateGrades(List<GradeUpdateRequest> model, int userId);
        List<GradeType> GetAllGradeTypes(string isReplay);
    }

    public interface IAssignmentService
    {
        int Add(AssignmentAddRequest model, int userId);
        void Delete(int id);
        void Update(AssignmentUpdateRequest model, int userId);
        GameAssignments Get(int id);
        int AddWithPositions(AssignmentPositionAddRequest model, int userId);
    }

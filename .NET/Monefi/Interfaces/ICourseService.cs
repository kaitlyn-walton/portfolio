
    public interface ICourseService
    {
        Course Get(int id);
        List<CourseSubject> GetSubjects();
        Paged<Course> GetCreatedByPaginated(int id, int page, int pageSize);
        int Add(CourseAddRequest model, int userId);
        Paged<Course> SearchPagination(int pageIndex, int pageSize, string query, int? lectureTypeId);
        Paged<Course> GetPaginated(int pageIndex, int pageSize);
        void Update(CourseUpdateRequest model, int userId);
        Boolean CheckCourseSubscription(int UserId, int CourseId);
        Boolean CheckWebSubscription(int UserId);
        void AddCourseSubscription(int courseId, int userId);
        void DeleteCourseSubsciption(int userId, int courseId);
        List<BaseUser> GetSubscribersByCourse(int courseId);
        List<CourseSubscription> GetAllCourseSubscribers();
    }

public class CourseService : ICourseService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IBaseUserMapper _userMapper = null;

        public CourseService(IDataProvider data, ILookUpService lookUpService, IBaseUserMapper baseUserMapper)
        {
            _data = data;
            _lookUpService = lookUpService;
            _userMapper = baseUserMapper;
        }
        public Course Get(int id)
        {
            string procName = "[dbo].[Courses_SelectById]";
            Course course = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                course = MapSingleCourse(reader, ref startingIndex);
            }
            );
            return course;
        }
        public List<BaseUser> GetSubscribersByCourse(int courseId)
        {
            string procName = "[dbo].[CourseSubscribers_Select]";
            List<BaseUser> users = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CourseId", courseId);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                BaseUser aUser = _userMapper.MapBaseUser(reader, ref startingIndex);
                if (users == null)
                {
                    users = new List<BaseUser>();
                }
                users.Add(aUser);
            }
            );
            return users;
        }

        public List<CourseSubscription> GetAllCourseSubscribers()
        {
            List<CourseSubscription> list = null;
            string procName = "[dbo].[CourseSubscribers_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                CourseSubscription sub = MapSingleSubscription(reader, ref startingIndex);
                if (list == null)
                {
                    list = new List<CourseSubscription>();
                }
                list.Add(sub);
            });
            return list;
        }

        public List<CourseSubject> GetSubjects()
        {

            List<CourseSubject> subjects = null;
            string procName = "[dbo].[Courses_Select_Unique_Subjects]";
            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    CourseSubject aSubject = MapSingleCourseSubject(reader, ref startingIndex);
                    if (subjects == null)
                    {
                        subjects = new List<CourseSubject>();
                    }
                    subjects.Add(aSubject);
                });
            return subjects;
        }
        public Paged<Course> GetCreatedByPaginated(int id, int pageIndex, int pageSize)
        {
            Paged<Course> pagedResult = null;
            List<Course> coursesCreatedByPaginated = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Courses_Select_ByCreatedBy]",
                (param) =>
                {
                    param.AddWithValue("@Id", id);
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Course course = MapSingleCourse(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }
                    if (coursesCreatedByPaginated == null)
                    {
                        coursesCreatedByPaginated = new List<Course>();
                    }
                    coursesCreatedByPaginated.Add(course);
                }
                );
            if (coursesCreatedByPaginated != null)
            {
                pagedResult = new Paged<Course>(coursesCreatedByPaginated, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        public Paged<Course> SearchPagination(int pageIndex, int pageSize, string query, int? lectureTypeId)
        {
            Paged<Course> pagedResult = null;
            List<Course> coursesSearchPaginated = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Courses_SearchV2]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                    param.AddWithValue("@LectureTypeId", lectureTypeId);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Course course = MapSingleCourse(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }
                    if (coursesSearchPaginated == null)
                    {
                        coursesSearchPaginated = new List<Course>();
                    }
                    coursesSearchPaginated.Add(course);
                }
                );
            if (coursesSearchPaginated != null)
            {
                pagedResult = new Paged<Course>(coursesSearchPaginated, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        public Paged<Course> GetPaginated(int pageIndex, int pageSize)
        {
            Paged<Course> pagedList = null;
            List<Course> coursesPaginated = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Courses_SelectAll]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Course course = MapSingleCourse(reader, ref startingIndex);
                    if (coursesPaginated == null)
                    {
                        coursesPaginated = new List<Course>();
                    }
                    coursesPaginated.Add(course);
                }
                );
            if (coursesPaginated != null)
            {
                pagedList = new Paged<Course>(coursesPaginated, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public int Add(CourseAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Courses_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    AddCommonParams(model, collection);
                    collection.AddWithValue("@CreatedBy", userId);
                    collection.AddWithValue("@InstructorId", userId);
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    collection.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    Int32.TryParse(oId.ToString(), out id);
                });
            return id;
        }
        public void Update(CourseUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Courses_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    AddCommonParams(model, collection);
                    collection.AddWithValue("@Id", model.Id);
                    collection.AddWithValue("@ModifiedBy", userId);
                    collection.AddWithValue("@InstructorId", userId);
                },
                returnParameters: null);
        }
        public Boolean CheckCourseSubscription(int UserId, int CourseId)
        {
            string procName = "[dbo].[Courses_CheckSubscription]";
            Boolean result = false;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", UserId);
                col.AddWithValue("@CourseId", CourseId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int index = 0;
                int returnNumber = reader.GetSafeInt32(index++);
                if (returnNumber == 1)
                {
                    result = true;
                }
            });
            return result;
        }

        public Boolean CheckWebSubscription(int UserId)
        {
            string procName = "[dbo].[Subscriptions_Check]";
            Boolean result = false;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", UserId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int index = 0;
                int returnNumber = reader.GetSafeInt32(index++);
                if (returnNumber == 1)
                {
                    result = true;
                }
            });
            return result;
        }

        public void AddCourseSubscription(int courseId, int userId)
        {
            string procName = "[dbo].[CourseSubscription_Insert_SubscriberV2]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@CourseId", courseId);
                },
                returnParameters: null);
        }

        public void DeleteCourseSubsciption(int userId, int courseId)
        {
            string procName = "[dbo].[CourseSubscription_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@CourseId", courseId);

            }, returnParameters: null);
        }

        private CourseSubscription MapSingleSubscription(IDataReader reader, ref int startingIndex)
        {
            CourseSubscription sub = new CourseSubscription();

            sub.User = _userMapper.MapBaseUser(reader, ref startingIndex);
            sub.CourseIds = reader.GetSafeString(startingIndex++);
            sub.CourseNames = reader.GetSafeString(startingIndex++);

            return sub;
        }

        private Course MapSingleCourse(IDataReader reader, ref int startingIndex)
        {
            Course aCourse = new Course();

            aCourse.Id = reader.GetSafeInt32(startingIndex++);
            aCourse.Title = reader.GetSafeString(startingIndex++);
            aCourse.Subject = reader.GetSafeString(startingIndex++);
            aCourse.Description = reader.GetSafeString(startingIndex++);
            aCourse.Instructor = _userMapper.MapBaseUser(reader, ref startingIndex);
            aCourse.Duration = reader.GetSafeString(startingIndex++);
            aCourse.LectureType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aCourse.CoverImageUrl = reader.GetSafeString(startingIndex++);
            aCourse.StatusName = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aCourse.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aCourse.DateModified = reader.GetSafeDateTime(startingIndex++);
            aCourse.CreatedBy = _userMapper.MapBaseUser(reader, ref startingIndex);
            aCourse.ModifiedBy = reader.GetSafeInt32(startingIndex++);

            return aCourse;
        }

        private CourseSubject MapSingleCourseSubject(IDataReader reader, ref int startingIndex)
        {
            CourseSubject aSubject = new CourseSubject();
            aSubject.Subject = reader.GetSafeString(startingIndex++);
            return aSubject;
        }

        private static void AddCommonParams(CourseAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@Title", model.Title);
            collection.AddWithValue("@Subject", model.Subject);
            collection.AddWithValue("@Description", model.Description);
            collection.AddWithValue("@Duration", model.Duration);
            collection.AddWithValue("@LectureTypeId", model.LectureTypeId);
            collection.AddWithValue("@CoverImageUrl", model.CoverImageUrl);
            collection.AddWithValue("@StatusId", model.StatusId);
        }
    }

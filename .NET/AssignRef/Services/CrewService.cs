
    public class CrewService : ICrewService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;       
        ILookUpService _lookUpService = null;
        ILocationMapper _locationMapper = null;
        public CrewService(IDataProvider data, IBaseUserMapper userMapper,ILookUpService lookUpService, ILocationMapper locationMapper)
        {
            _data = data;
            _userMapper = userMapper;
            _locationMapper = locationMapper;
            _lookUpService = lookUpService;
        }
        public int Add(CrewAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Crews_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                CrewsAddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
               
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public void Update(CrewUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Crews_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                CrewsAddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@CreatedBy", userId);

            }, returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Crews_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);

            }, returnParameters: null);
        }       
        public Crew SelectByUserId(int userId) 
        {
            string procName = "[dbo].[Crews_Select_ByUserId]";
            Crew crew = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                crew = CrewMapper(reader, ref startingIndex);
            }
            );
            return crew;
        }
        public Paged<Crew> SelectByPositionId(int pageIndex, int pageSize, string query, int id)
        {
            Paged<Crew> pagedList = null;
            List<Crew> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Crews_Select_ByPositionId]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@PositionId", id);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                Crew crew = CrewMapper(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }

                if (list == null)
                {
                    list = new List<Crew>();
                }
                list.Add(crew);
            });
            if (list != null)
            {
                pagedList = new Paged<Crew>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<Crew> SelectByConferenceId(int pageIndex, int pageSize, int id)
        {
            Paged<Crew> pagedList = null;
            List<Crew> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Crews_Select_ByConferenceId]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@ConferenceId", id);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                Crew crew = CrewMapper(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }

                if (list == null)
                {
                    list = new List<Crew>();
                }
                list.Add(crew);
            });
            if (list != null)
            {
                pagedList = new Paged<Crew>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        public Paged<Crew> CrewSelectAll(int pageIndex, int pageSize)
        {
            string proc = "[dbo].[Crews_SelectAll]";
            Paged<Crew> pagedList = null;
            List<Crew> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(proc, (param) =>
            {

                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }, (reader, recordSetIndex) =>
            {
                int index = 0;
                Crew model = CrewMapper(reader, ref index);
                totalCount = reader.GetSafeInt32(index);

                if (list == null)
                {
                    list = new List<Crew>();
                }
                list.Add(model);
            });
            if (list != null)
            {
                pagedList = new Paged<Crew>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<Crew> CrewSearch(int pageIndex, int pageSize, string query)
        {
            Paged<Crew> pagedList = null;
            List<Crew> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Crews_Search]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@Query", query);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                Crew crew = CrewMapper(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }

                if (list == null)
                {
                    list = new List<Crew>();
                }
                list.Add(crew);
            });
            if (list != null)
            {
                pagedList = new Paged<Crew>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        private static void CrewsAddCommonParams(CrewAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@SeasonId", model.SeasonId);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@StatusTypeId", model.StatusTypeId);     
        }
        private Crew CrewMapper(IDataReader reader, ref int startingIndex)
        {
            Crew aCrew = new Crew();
        
            aCrew.CrewId = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aCrew.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aCrew.DateModified = reader.GetSafeDateTime(startingIndex++);
            aCrew.StatusType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aCrew.Season = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aCrew.ConferenceId= reader.GetSafeInt32(startingIndex++);
            aCrew.OfficialId = reader.GetSafeInt32(startingIndex++);
            aCrew.Creator = _userMapper.MapBaseUser(reader,ref startingIndex);
            aCrew.Location = _locationMapper.MapLocation(reader,ref startingIndex);           
            aCrew.FieldPosition = _lookUpService.MapLookUp3Col(reader, ref startingIndex);

            return aCrew;            
        }

        public List<LookUp3Col> SelectByCrewNumber(int crewNumber, string replayOfficials, string alternateOfficial)
        {
            string procName = "[dbo].[FieldPositions_SelectByCrewNeeded]";
            List<LookUp3Col> list = null;
            

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@CrewNumber", crewNumber);
                parameterCollection.AddWithValue("@ReplayOfficials", replayOfficials);
                parameterCollection.AddWithValue("@AlternateOfficial", alternateOfficial);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                LookUp3Col crewNum = _lookUpService.MapLookUp3Col(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<LookUp3Col>();
                }
                list.Add(crewNum);
            }
            );
            return list;
        }
    }    

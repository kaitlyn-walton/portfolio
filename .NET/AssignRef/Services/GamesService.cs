public class GamesService : IGamesService, IMapGame
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        public GamesService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;
        }
        public Game GetById(int id)
        {
            string procName = "[dbo].[Games_Select_ById_V2]";
            Game game = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                game = MapSingleGame(reader, ref startingIdex);
            }
            );
            return game;
        }
        public List<Game> GetBySeasonId(int seasonId)
        {
            string procName = "[dbo].[Games_Select_BySeasonId]";

            List<Game> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@SeasonId", seasonId);
                }
                , delegate (IDataReader reader, short set)
                {
                    int startingIdex = 0;
                    Game game = MapSingleGame(reader, ref startingIdex);

                    if (list == null)
                    {
                        list = new List<Game>();
                    }
                    list.Add(game);
                }
                );
            return list;
        }
        public Paged<Game> GetBySeasonIdPaginated(int pageIndex, int pageSize, int id)
        {
            Paged<Game> pagedList = null;
            List<Game> gameList = null;
            int totalCount = 0;

            string procName = "[dbo].[Games_Select_Paginated_BySeasonId_V2]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                    collection.AddWithValue("@SeasonId", id);
                },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Game aGame = MapSingleGame(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (gameList == null)
                {
                    gameList = new List<Game>();
                }
                gameList.Add(aGame);
            });

            if (gameList != null)
            {
                pagedList = new Paged<Game>(gameList, pageIndex, pageSize, totalCount);

            }
            return pagedList;
        }
        public List<Game> GetBySeasonIdAndWeek(int seasonId, int week)
        {
            string procName = "[dbo].[Games_Select_ByWeek_SeasonId]";

            List<Game> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@SeasonId", seasonId);
                parameterCollection.AddWithValue("@Week", week);
            }
                , delegate (IDataReader reader, short set)
                {
                    int startingIdex = 0;
                    Game game = MapSingleGame(reader, ref startingIdex);

                    if (list == null)
                    {
                        list = new List<Game>();
                    }
                    list.Add(game);
                }
                );
            return list;
        }
        public int Add(GameAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Games_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);


                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            }
            );
            return id;
        }
        public void Update(GameUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Games_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@ModifiedBy", userId);
            }, returnParameters: null
            );
        }
        public void Delete(int id, int userId)
        {
            string procName = "[dbo].[Games_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
                col.AddWithValue("@ModifiedBy", userId);
            });
        }
        public Game MapSingleGame(IDataReader reader, ref int startingIdex)
        {
            Game aGame = new Game();
            aGame.Id = reader.GetSafeInt32(startingIdex++);
            aGame.GameStatus = _lookUpService.MapSingleLookUp(reader, ref startingIdex);
            aGame.Season = new BaseSeason();
            aGame.Season.Id = reader.GetSafeInt32(startingIdex++);
            aGame.Season.Name = reader.GetSafeString(startingIdex++);
            aGame.Season.Year = reader.GetSafeInt32(startingIdex++);
            aGame.Week = reader.GetSafeInt32(startingIdex++);
            aGame.Conference = new BaseConference();
            aGame.Conference.Id = reader.GetSafeInt32(startingIdex++);
            aGame.Conference.Logo = reader.GetSafeString(startingIdex++);
            aGame.Conference.Name = reader.GetSafeString(startingIdex++);
            aGame.Conference.Code = reader.GetSafeString(startingIdex++);
            aGame.HomeTeam = MapSingleGamesTeam(reader, ref startingIdex);
            aGame.VisitingTeam = MapSingleGamesTeam(reader, ref startingIdex);
            aGame.StartTime = reader.GetSafeDateTime(startingIdex++);
            aGame.IsNonConference = reader.GetSafeBool(startingIdex++);
            aGame.Venue = new BaseVenue();
            aGame.Venue.Id = reader.GetSafeInt32(startingIdex++);
            aGame.Venue.Name = reader.GetSafeString(startingIdex++);
            aGame.Venue.Location = new Location();
            aGame.Venue.Location.Id = reader.GetSafeInt32(startingIdex++);
            aGame.Venue.Location.LocationType = _lookUpService.MapSingleLookUp(reader, ref startingIdex);
            aGame.Venue.Location.LineOne = reader.GetSafeString(startingIdex++);
            aGame.Venue.Location.LineTwo = reader.GetSafeString(startingIdex++);
            aGame.Venue.Location.City = reader.GetSafeString(startingIdex++);
            aGame.Venue.Location.State = _lookUpService.MapLookUp3Col(reader, ref startingIdex);
            aGame.Venue.Location.Zip = reader.GetSafeString(startingIdex++);
            aGame.Venue.Location.Lat = reader.GetSafeDouble(startingIdex++);
            aGame.Venue.Location.Long = reader.GetSafeDouble(startingIdex++);
            aGame.Venue.PrimaryImageUrl = reader.GetSafeString(startingIdex++);
            aGame.DateCreated = reader.GetSafeDateTime(startingIdex++);
            aGame.DateModified = reader.GetSafeDateTime(startingIdex++);
            aGame.IsDeleted = reader.GetSafeBool(startingIdex++);
            aGame.CreatedBy = reader.GetSafeInt32(startingIdex++);
            aGame.ModifiedBy = reader.GetSafeInt32(startingIdex++);
            return aGame;
        }
        private static void AddCommonParams(GameAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@StartTime", model.StartTime);
            col.AddWithValue("@VenueId", model.VenueId);
            col.AddWithValue("@SeasonId", model.SeasonId);
            col.AddWithValue("@Week", model.Week);
            col.AddWithValue("@HomeTeamId", model.HomeTeamId);
            col.AddWithValue("@VisitingTeamId", model.VisitingTeamId);
            col.AddWithValue("@isNonConference", model.IsNonConference);
            col.AddWithValue("@ConferenceId", model.ConferenceId);

        }

        private Team MapSingleGamesTeam(IDataReader reader, ref int startingIndex)
        {
            Team team = new Team();
            team.Conference = new BaseConference();
            team.MainVenue = new BaseVenue();
            team.Location = new Location();
            team.Location.State = new LookUp3Col();

            team.Id = reader.GetSafeInt32(startingIndex++);
            team.Name = reader.GetSafeString(startingIndex++);
            team.Code = reader.GetSafeString(startingIndex++);
            team.Logo = reader.GetSafeString(startingIndex++);
            team.Conference.Logo = reader.GetSafeString(startingIndex++);
            team.Conference.Name = reader.GetSafeString(startingIndex++);
            team.MainVenue.Name = reader.GetSafeString(startingIndex++);
            team.Location.City = reader.GetSafeString(startingIndex++);
            team.Location.State.Code = reader.GetSafeString(startingIndex++);
            team.SiteUrl = reader.GetSafeString(startingIndex++);
            team.TeamMembers = reader.DeserializeObject<List<BaseTeamMember>>(startingIndex++);
            return team;
        }

        public List<Game> GetBySeasonIdConferenceId(int seasonId,int conferenceId)
        {
            string procName = "[dbo].[Games_SelectBySeasonId_ConferenceId]";

            List<Game> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@SeasonId", seasonId);
                parameterCollection.AddWithValue("@ConferenceId", conferenceId);
            }
                , delegate (IDataReader reader, short set)
                {
                    int startingIdex = 0;
                    Game game = MapSingleGame(reader, ref startingIdex);

                    if (list == null)
                    {
                        list = new List<Game>();
                    }
                    list.Add(game);
                }
                );
            return list;
        }
    }

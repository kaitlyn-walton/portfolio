using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Fouls;
using Sabio.Models.Domain.Grades;
using Sabio.Models.Domain.Seasons;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Services
{
    public class GradeFoulAnalyticService : IGradeFoulAnalyticService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;

        public GradeFoulAnalyticService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public List<FoulsByUser> GetFoulsByUser(int seasonId, int userId, int conferenceId)
        {
            List<FoulsByUser> list = null;
            string procName = "[dbo].[Users_FoulAnalytics_BySeason]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@SeasonId", seasonId);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@ConferenceId", conferenceId);

            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                FoulsByUser user = MapSingleUserFoul(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<FoulsByUser>();
                }
                list.Add(user);
            }
            );
            return list;
        }

        public List<GradesBySeason> GetGradesBySeason(int seasonId, int conferenceId)
        {
            List<GradesBySeason> list = null;
            string procName = "[dbo].[Grades_Analytics_BySeason]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@SeasonId", seasonId);
                col.AddWithValue("@ConferenceId", conferenceId);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                GradesBySeason grade = MapSingleGradeBySeason(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<GradesBySeason>();
                }
                list.Add(grade);
            }
            );
            return list;
        }

        public List<GradesByFoulBySeason> GetGradesByFoul(int foulId, int seasonId, int conferenceId)
        {
            List<GradesByFoulBySeason> list = null;
            string procName = "[dbo].[Grades_FoulTypeAnalytics]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@FoulTypeId", foulId);
                col.AddWithValue("@SeasonId", seasonId);
                col.AddWithValue("@ConferenceId", conferenceId);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                GradesByFoulBySeason grade = MapGradesByFoulSeason(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<GradesByFoulBySeason>();
                }
                list.Add(grade);
            });
            return list;
        }

        public List<FoulsBySeason> GetFoulForSeasons(int seasonId, int conferenceId)
        {
            List<FoulsBySeason> list = null;
            string procName = "[dbo].[Seasons_FoulAnalytics]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@SeasonId", seasonId);
                col.AddWithValue("@ConferenceId", conferenceId);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                FoulsBySeason foul = MapSingleFoulBySeason(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<FoulsBySeason>();
                }
                list.Add(foul);
            }
            );
            return list;
        }

        public List<TeamFoulCount> GetTeamFouls(int gameId)
        {
            List<TeamFoulCount> list = null;
            string procName = "[dbo].[Teams_FoulAnalytics]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@GameId", gameId);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                TeamFoulCount team = MapSingleTeamFoul(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<TeamFoulCount>();
                }
                list.Add(team);
            });
            return list;
        }

        private static TeamFoulCount MapSingleTeamFoul(IDataReader reader, ref int startingIndex)
        {
            TeamFoulCount team = new TeamFoulCount();

            team.HomeTeam = reader.GetSafeInt32(startingIndex++);
            team.HomeTeamPercentage = reader.GetSafeDecimal(startingIndex++);
            team.VisitingTeam = reader.GetSafeInt32(startingIndex++);
            team.VisitingTeamPercentage = reader.GetSafeDecimal(startingIndex++);

            return team;
        }

        private FoulsByUser MapSingleUserFoul(IDataReader reader, ref int startingIndex)
        {
            FoulsByUser fouls = new FoulsByUser();

            fouls.Season = MapSingleSeason(reader, ref startingIndex);
            fouls.ConferenceId = reader.GetSafeInt32(startingIndex++);
            fouls.User = _userMapper.MapBaseUser(reader, ref startingIndex);
            fouls.Total = reader.GetSafeInt32(startingIndex++);

            return fouls;
        }

        private static GradesBySeason MapSingleGradeBySeason(IDataReader reader, ref int startingIndex)
        {
            GradesBySeason grade = new GradesBySeason();

            grade.Season = MapSingleSeason(reader, ref startingIndex);
            grade.ConferenceId = reader.GetSafeInt32(startingIndex++);
            grade.Total = reader.GetSafeInt32(startingIndex++);
            grade.CCNumber = reader.GetSafeInt32(startingIndex++);
            grade.ICNumber = reader.GetSafeInt32(startingIndex++);
            grade.MCNumber = reader.GetSafeInt32(startingIndex++);

            return grade;
        }

        private static FoulsBySeason MapSingleFoulBySeason(IDataReader reader, ref int startingIndex)
        {
            FoulsBySeason foul = new FoulsBySeason();

            foul.Season = MapSingleSeason(reader, ref startingIndex);
            foul.ConferenceId = reader.GetSafeInt32(startingIndex++);
            foul.Total = reader.GetSafeInt32(startingIndex++);

            return foul;
        }

        private static GradesByFoulBySeason MapGradesByFoulSeason(IDataReader reader, ref int startingIndex)
        {
            GradesByFoulBySeason grade = new GradesByFoulBySeason();

            grade.Season = MapSingleSeason(reader, ref startingIndex);
            grade.ConferenceId = reader.GetSafeInt32(startingIndex++);
            grade.Total = reader.GetSafeInt32(startingIndex++);
            grade.CCNumber = reader.GetSafeInt32(startingIndex++);
            grade.ICNumber = reader.GetSafeInt32(startingIndex++);
            grade.MCNumber = reader.GetSafeInt32(startingIndex++);
            grade.Foul = reader.GetSafeString(startingIndex++);

            return grade;
        }

        private static Season MapSingleSeason(IDataReader reader, ref int startingIndex)
        {
            Season season = new Season();
            season.Id = reader.GetSafeInt32(startingIndex++);
            season.Name = reader.GetSafeString(startingIndex++);
            season.Year = reader.GetSafeInt32(startingIndex++);
            return season;
        }

        public List<BaseUser> GetAllUsers(int conferenceId)
        {
            List<BaseUser> list = null;
            string procName = "[dbo].[Users_SelectAllSimple]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate(SqlParameterCollection col)
            {
                col.AddWithValue("@ConferenceId", conferenceId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                BaseUser user = _userMapper.MapBaseUser(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<BaseUser>();
                }
                list.Add(user);
            });
            return list;
        }

    }

}

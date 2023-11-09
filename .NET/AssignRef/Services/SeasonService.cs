using Sabio.Data.Providers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Seasons;
using Sabio.Data;
using Sabio.Models.Requests.Seasons;
using System.Reflection.PortableExecutable;
using System.Reflection;
using Sabio.Web.Core.Services;
using Sabio.Models.Domain.Conferences;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain.Crews;

namespace Sabio.Services
{
    
    public class SeasonService : ISeasonService
    {

        IDataProvider _data = null;
        ILookUpService _lookUpService = null;

        public SeasonService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;
        }

        public Season GetSeasonById(int id)
        {
            string procName = "[dbo].[Seasons_Select_ById]";

            Season season = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                season = MapSingleSeason(reader);
            });
            return season;
        }

        public List<Season> GetSeasonsByConferenceId(int id)
        {
            string procName = "[dbo].[Seasons_Select_ByConferenceId]";

            List<Season> seasons = new List<Season>();
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                Season season = MapSingleSeason(reader);
                seasons.Add(season);
            });
            return seasons;
        }

        public List<Season> GetAll()
        {
            string procName = "[dbo].[Seasons_SelectAll]";

            List<Season> seasons = new List<Season>();
            _data.ExecuteCmd(procName, null,
                delegate (IDataReader reader, short set)
                {
                    Season season = MapSingleSeason(reader);
                    seasons.Add(season);
                }
            );
            return seasons;
        }

        public int AddSeason(SeasonAddRequest model)
        {

            int id = 0;

            string procName = "[dbo].[Seasons_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);

                },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);

            });

            return id;
        }

        public void UpdateSeason(SeasonUpdateRequest model)
        {
            string procName = "[dbo].[Seasons_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                },
                returnParameters: null);
        }

        public void DeleteSeasonById(int id)
        {
            string procName = "[dbo].[Seasons_Delete]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                });
        }

        private Season MapSingleSeason(IDataReader reader)
        {
            int startingIndex = 0;

            var aSeason = new Season
            {
                Id = reader.GetSafeInt32(startingIndex++),
                Name = reader.GetSafeString(startingIndex++),
                Year = reader.GetSafeInt32(startingIndex++),
                Conference = new BaseConference
                {
                    Id = reader.GetSafeInt32(startingIndex++),
                    Name = reader.GetSafeString(startingIndex++),
                    Code = reader.GetSafeString(startingIndex++),
                    Logo = reader.GetSafeString(startingIndex++)
                },
                StatusType = _lookUpService.MapSingleLookUp(reader, ref startingIndex),
                Weeks = reader.GetSafeInt32(startingIndex++),
                DateCreated = reader.GetDateTime(startingIndex++),
                DateModified = reader.GetDateTime(startingIndex++)
            };

            return aSeason;
        }

        private static void AddCommonParams(SeasonAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Year", model.Year);
            col.AddWithValue("@ConferenceId", model.ConferenceId);
            col.AddWithValue("@StatusTypeId", model.StatusTypeId);
            col.AddWithValue("@Weeks", model.Weeks);
        }
    }
}

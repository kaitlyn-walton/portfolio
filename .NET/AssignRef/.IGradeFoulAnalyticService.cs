using Sabio.Models.Domain;
using Sabio.Models.Domain.Seasons;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IGradeFoulAnalyticService
    {
        List<FoulsByUser> GetFoulsByUser(int seasonId, int userId, int conferenceId);
        List<GradesBySeason> GetGradesBySeason(int seasonId, int conferenceId);
        List<GradesByFoulBySeason> GetGradesByFoul(int foulId, int seasonId, int conferenceId);
        List<FoulsBySeason> GetFoulForSeasons(int seasonId, int conferenceId);
        List<TeamFoulCount> GetTeamFouls(int gameId);
        List<BaseUser> GetAllUsers(int conferenceId);
    }
}

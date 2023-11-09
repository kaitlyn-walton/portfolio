using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Grades;
using Sabio.Models.Domain.Seasons;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/analytics")]
    [ApiController]
    public class GradeFoulAnalyticApiController : BaseApiController
    {
        private IGradeFoulAnalyticService _service = null;

        public GradeFoulAnalyticApiController(IGradeFoulAnalyticService service, ILogger<GradeFoulAnalyticApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpGet("conference/{conferenceId:int}/season/{seasonId:int}/user/{userId:int}")]
        public ActionResult<ItemsResponse<FoulsByUser>> FoulsBySeason(int seasonId, int userId, int conferenceId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<FoulsByUser> list = _service.GetFoulsByUser(seasonId, userId, conferenceId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Unable to find any fouls for this user.");
                }
                else
                {
                    response = new ItemsResponse<FoulsByUser> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("conference/{conferenceId:int}/grades/{seasonId:int}")]
        public ActionResult<ItemsResponse<GradesBySeason>> GetGradesBySeason(int seasonId, int conferenceId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<GradesBySeason> list = _service.GetGradesBySeason(seasonId, conferenceId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Unable to find any grades for this season.");
                }
                else
                {
                    response = new ItemsResponse<GradesBySeason> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("conference/{conferenceId:int}/grades/foul/{foulId:int}/season/{seasonId:int}")]
        public ActionResult<ItemsResponse<GradesByFoulBySeason>> GetGradesByFoulId(int foulId, int seasonId, int conferenceId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<GradesByFoulBySeason> list = _service.GetGradesByFoul(foulId, seasonId, conferenceId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Unable to find any grades for this foul.");
                }
                else
                {
                    response = new ItemsResponse<GradesByFoulBySeason> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("conference/{conferenceId:int}/fouls/{seasonId:int}")]
        public ActionResult<ItemsResponse<FoulsBySeason>> GetFouls(int seasonId, int conferenceId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<FoulsBySeason> list = _service.GetFoulForSeasons(seasonId, conferenceId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Unable to find fouls for this season.");
                }
                else
                {
                    response = new ItemsResponse<FoulsBySeason> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("teams/{gameId:int}")]
        public ActionResult<ItemsResponse<TeamFoulCount>> GetTeamFoulsByGame(int gameId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<TeamFoulCount> list = _service.GetTeamFouls(gameId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Unable to find any fouls for this game.");
                }
                else
                {
                    response = new ItemsResponse<TeamFoulCount> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("conference/{conferenceId:int}/allusers")]
        public ActionResult<ItemsResponse<BaseUser>> GetAllUser(int conferenceId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<BaseUser> list = _service.GetAllUsers(conferenceId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Unable to find any users.");
                }
                else
                {
                    response = new ItemsResponse<BaseUser> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}

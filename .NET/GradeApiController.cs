using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Grades;
using Sabio.Models.Requests.Grades;
using Sabio.Models.Requests.ReplayEntries;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/grades")]
    [ApiController]
    public class GradeApiController : BaseApiController
    {
        private IGradeService _gradeService = null;
        private IAuthenticationService<int> _authService = null;

        public GradeApiController(IGradeService gradeService, IAuthenticationService<int> authService, ILogger<GradeApiController> logger) : base(logger)
        {
            _gradeService = gradeService;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> GradeAdd(GradeAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _gradeService.AddGrade(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> GradeUpdate(GradeUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _gradeService.UpdateGrade(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}/replay")]
        public ActionResult<SuccessResponse> ReplayGradeDelete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {             
                _gradeService.ReplayGradeDeleteById(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> GradeSoftDelete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _gradeService.SoftDeleteGrade(id, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("foul")]
        public ActionResult<ItemResponse<Paged<Grade>>> GradeSelectByFoul(int pageIndex, int pageSize, int foulId)
        {
            ActionResult result = null;

            try
            {
                Paged<Grade> pagedList = _gradeService.SelectByFoul(pageIndex, pageSize, foulId);

                if (pagedList == null)
                {
                    result = NotFound404(new ErrorResponse("Did not find any grades that matched that foul."));
                }
                else
                {
                    ItemResponse<Paged<Grade>> response = new ItemResponse<Paged<Grade>>();
                    response.Item = pagedList;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpPost("batch")]
        public ActionResult<ItemResponse<List<int>>> GradeAddMany(List<GradeAddRequest> model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<int> ids = _gradeService.BatchInsertGrades(model, userId);

                ItemResponse<List<int>> response = new ItemResponse<List<int>>() { Item = ids };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPost("batch/replay")]
        public ActionResult<ItemResponse<List<int>>> ReplayGradeAddMany(List<ReplayEntryGradeAddRequest> model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<int> ids = _gradeService.AddBatchReplayGrade(model, userId);

                ItemResponse<List<int>> response = new ItemResponse<List<int>>() { Item = ids };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("batch/replay")]
        public ActionResult<SuccessResponse> ReplayGradeUpdateMany(List<ReplayEntryGradeUpdateRequest> model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _gradeService.BatchUpdateReplayGrades(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("batch")]
        public ActionResult<SuccessResponse> GradeUpdateMany(List<GradeUpdateRequest> model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _gradeService.BatchUpdateGrades(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("types")]
        public ActionResult<ItemsResponse<GradeType>> GetAll(string isReplay)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<GradeType> list = _gradeService.GetAllGradeTypes(isReplay);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Unable to find grade types.");
                }
                else
                {
                    response = new ItemsResponse<GradeType> { Items = list };
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

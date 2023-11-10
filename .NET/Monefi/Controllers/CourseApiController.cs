using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System.Data.SqlClient;
using System;
using Sabio.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseApiController : BaseApiController
    {
        private ICourseService _service = null;
        private IAuthenticationService<int> _authService = null;
        public CourseApiController(ICourseService service,
        ILogger<CourseApiController> logger,
        IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Course>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Course course = _service.Get(id);

                if (course == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Course not found");
                }
                else
                {
                    response = new ItemResponse<Course> { Item = course };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }
            return StatusCode(iCode, response);
        }
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<ItemsResponse<CourseSubject>> GetSubjects()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<CourseSubject> list = _service.GetSubjects();

                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Subjects not found");
                }
                else
                {
                    iCode = 200;
                    response = new ItemsResponse<CourseSubject> { Items = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("createdby/{id:int}")]
        public ActionResult<ItemResponse<Paged<Course>>> GetCreatedByPaginated(int id, int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Course> paged = _service.GetCreatedByPaginated(id, pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Course>> response = new ItemResponse<Paged<Course>>();
                    response.Item = paged;
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

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Course>>> GetPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Course> paged = _service.GetPaginated(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Course>> response = new ItemResponse<Paged<Course>>();
                    response.Item = paged;
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
        [AllowAnonymous]
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Course>>> SearchPagination(int pageIndex, int pageSize, string query, int? lectureTypeId)
        {
            if (lectureTypeId == null)
            {
                lectureTypeId = null;
            }
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Course> page = _service.SearchPagination(pageIndex, pageSize, query, lectureTypeId);
                if (page == null)
                {
                    code = 404;
                    response = new ItemResponse<Paged<Course>> { Item = page };
                }
                else
                {
                    response = new ItemResponse<Paged<Course>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(CourseAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int newCourseId = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = newCourseId };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(CourseUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("check")]
        public ActionResult<ItemResponse<Boolean>> CheckCourseSubscription(int courseId)
        {
            BaseResponse response = null;
            int iCode = 200;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Boolean result = _service.CheckCourseSubscription(userId, courseId);
                response = new ItemResponse<Boolean> { Item = result };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("check/web")]
        public ActionResult<ItemResponse<Boolean>> CheckWebSubscription()
        {
            BaseResponse response = null;
            int iCode = 200;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Boolean result = _service.CheckWebSubscription(userId);
                response = new ItemResponse<Boolean> { Item = result };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("subscribe")]
        public ActionResult<SuccessResponse> CourseSubscribe(int courseId)
        {
            int iCode = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                if (courseId > 0)
                {
                    _service.AddCourseSubscription(courseId, userId);
                    response = new SuccessResponse();
                }
                else
                {
                    response = new ErrorResponse("Course ID is invalid");
                }

            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{userId:int}/{courseId:int}")]
        public ActionResult<SuccessResponse> Delete(int userId, int courseId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteCourseSubsciption(userId, courseId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("subscribers/{courseId:int}")]
        public ActionResult<ItemsResponse<BaseUser>> GetCourseSubscribers(int courseId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<BaseUser> list = _service.GetSubscribersByCourse(courseId);

                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Subscribers not found");
                }
                else
                {
                    iCode = 200;
                    response = new ItemsResponse<BaseUser> { Items = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("allsubscribers")]
        public ActionResult<ItemsResponse<CourseSubscription>> GetAllSubscribers()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<CourseSubscription> list = _service.GetAllCourseSubscribers();

                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Subscribers not found");
                }
                else
                {
                    iCode = 200;
                    response = new ItemsResponse<CourseSubscription> { Items = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }
            return StatusCode(iCode, response);

        }


    }
}

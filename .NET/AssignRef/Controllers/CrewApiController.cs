    [Route("api/crews")]
    [ApiController]
    public class CrewApiController : BaseApiController
    {
        private ICrewService _crewService = null;
        private IAuthenticationService<int> _authService = null;
        public CrewApiController(ICrewService service, ILogger<CrewApiController> logger
            , IAuthenticationService<int> authService) : base(logger) { _crewService = service;
            _authService = authService;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(CrewUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _crewService.Update(model, userId);


                response = new SuccessResponse();
            }

            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(CrewAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _crewService.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>();
                response.Item = id;
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

        [HttpGet("user/{id:int}")]
        public ActionResult<ItemResponse<Crew>> SelectByUser(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Crew crew = _crewService.SelectByUserId(id);


                if (crew == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not Found.");
                }

                else
                {
                    response = new ItemResponse<Crew> { Item = crew };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");

            }

            return StatusCode(iCode, response);

        }

        [HttpGet("conference/{id:int}")]
        public ActionResult<ItemResponse<Paged<Crew>>> SelectByConferenceId(int pageIndex, int pageSize, int id)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                Paged<Crew> page = _crewService.SelectByConferenceId(pageIndex, pageSize, id);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Crew>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);

        }

        [HttpGet("position/{id:int}")]
        public ActionResult<ItemResponse<Crew>> SelectByPosition(int pageIndex, int pageSize, string query, int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<Crew> crew = _crewService.SelectByPositionId(pageIndex, pageSize, query, id);


                if (crew == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not Found.");
                }

                else
                {
                    response = new ItemResponse<Paged<Crew>> { Item = crew };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");

            }

            return StatusCode(iCode, response);

        }

        [HttpGet("")]
        public ActionResult<ItemResponse<Paged<Crew>>> SelectAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Crew> page = _crewService.CrewSelectAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Crew>> { Item = page };
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

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Crew>>> CrewSearch(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Crew> page = _crewService.CrewSearch(pageIndex, pageSize, query);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Crew>> { Item = page };
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

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _crewService.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("crewNumber/{crewNumber:int}/")]
        public ActionResult<ItemsResponse<LookUp3Col>> GetByCrewNumber(int crewNumber, string replayOfficials, string alternateOfficial)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<LookUp3Col> list = _crewService.SelectByCrewNumber(crewNumber, replayOfficials, alternateOfficial);
               
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<LookUp3Col> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
    }

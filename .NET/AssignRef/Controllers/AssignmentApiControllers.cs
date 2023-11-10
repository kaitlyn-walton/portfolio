    [Route("api/assignments")]
    [ApiController]
    public class AssignmentApiController : BaseApiController
    {
        private IAssignmentService _assignmentService = null;
        private IAuthenticationService<int> _authService = null;

        public AssignmentApiController(IAssignmentService assignmentService
            ,ILogger<AssignmentApiController> logger
            ,IAuthenticationService<int> authSerivce) : base(logger)
        {
            _assignmentService = assignmentService;
            _authService = authSerivce;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(AssignmentAddRequest assignmentAdd)
        {
            ObjectResult result= null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _assignmentService.Add(assignmentAdd, userId);
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
        public ActionResult< SuccessResponse > Update(AssignmentUpdateRequest assignmentUpdate) 
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _assignmentService.Update(assignmentUpdate, userId);

                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code,response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult< SuccessResponse > Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _assignmentService.Delete(id);
                 response = new SuccessResponse();
               
            }
            catch (Exception ex) 
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code,response);  
          
        }

        [HttpGet("games/{gameId:int}")]
        public ActionResult<ItemResponse<GameAssignments>> GetByGameId(int gameId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                GameAssignments assignment = _assignmentService.Get(gameId);
                if (assignment == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not Found");               
                }
                else
                {
                    response = new ItemResponse<GameAssignments> { Item = assignment};
                }
            }
            catch(Exception ex)
            {
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code,response);
        }

        [HttpPost("positions")]
        public ActionResult<ItemResponse<int>> AddAssignment(AssignmentPositionAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _assignmentService.AddWithPositions(model, userId);
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
    }

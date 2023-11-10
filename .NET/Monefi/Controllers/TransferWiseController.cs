[Route("api/transfers")]
    [ApiController]
    public class TransferWiseApiController : BaseApiController
    {
        private ITransferWiseService _service = null;
        private IAuthenticationService<int> _authService = null;
        public TransferWiseApiController(ITransferWiseService transferWise
            , ILogger<TransferWiseApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = transferWise;
            _authService = authService;
        }

        [HttpGet("profiles")]
        public async Task<ActionResult<ItemResponse<List<WiseProfile>>>> GetProfiles()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<WiseProfile> profiles = await _service.GetProfiles();

                if (profiles == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<WiseProfile>> { Item = profiles};
                    
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);

        }

        [HttpGet("recipients")]
        public async Task<ActionResult<ItemResponse<RecipientList>>> GetRecipients(string currency)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                RecipientList profiles = await _service.GetRecripients(currency);

                if (profiles == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<RecipientList> { Item = profiles };
                     
            }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);

        }
         
        [HttpGet("recipients/form/{quoteId}")] 
        public async Task<ActionResult<ItemsResponse<RecipientForm>>> GetRecipientForm(string quoteId)
        {
            int iCode = 200;
            BaseResponse response = null;
             
            try
            {
                List<RecipientForm> forms = await _service.GetRecripientForm(quoteId);

                if (forms == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<RecipientForm> { Items = forms };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("recipients/form/{quoteId}")]
        public async Task<ActionResult<ItemsResponse<RecipientForm>>> UpdateRecipientForm(JsonElement model, string quoteId)
        {
            int iCode = 200;
            BaseResponse response = null;
            object body = JsonConvert.DeserializeObject<object>(model.ToString());

            try
            {
                List<RecipientForm> forms = await _service.UpdateRecipientForm(body, quoteId);

                if (forms == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<RecipientForm> { Items = forms };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("quotes/{profileId:int}")] 
        public async Task<ActionResult<ItemResponse<TransferWiseQuote>>> Create(QuoteAddRequest model , int profileId)
        {
            ObjectResult result = null;

            try
            {
                TransferWiseQuote quote = await _service.CreateQuote(model, profileId);

                ItemResponse<TransferWiseQuote> response = new ItemResponse<TransferWiseQuote>() { Item = quote };

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

        [HttpPost("recipients")]
        public async Task<ActionResult<ItemResponse<int>>> Create(JsonElement model)
        {
            ObjectResult result = null;
            object request = JsonConvert.DeserializeObject<object>(model.ToString());
             
            try 
            {
                int recipient = await _service.CreateRecipient(request);
                ItemResponse<int> response = new ItemResponse<int>() { Item = recipient };
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

        [HttpPost("form")]
        public async Task<ActionResult<ItemResponse<TransferForm>>> GetTransferFields(TransferAddRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                TransferForm form = await _service.GetTransferForm(model);

                if (form == null)
                { 
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<TransferForm> { Item = form };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ItemResponse<Transfer>>> CreateTransfer(TransferAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Transfer transfer = await _service.CreateTransfer(model, userId);
                ItemResponse<Transfer> response = new ItemResponse<Transfer>() { Item = transfer };
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

        [HttpGet("simulation/{transferId:int}/{status}")]
        public async Task<ActionResult<ItemResponse<Transfer>>> SimulateStatus(int transferId ,string status)
        {
            int iCode = 200;
            BaseResponse response = null;

            try 
            {
                Transfer transfer = await _service.SimulateStatus(transferId, status);

                if (transfer == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Transfer> { Item = transfer };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("{transferId:int}/receipt")]
        public async Task<ActionResult<ItemResponse<FileContentResult>>> GetReceipt(int transferId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                byte[] receiptArr = await _service.GetReceipt(transferId);
                
                if (receiptArr == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    FileContentResult receipt = File(receiptArr, "application/pdf", "receipt.pdf");
                    response = new ItemResponse<FileContentResult> { Item = receipt };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("{transferId:int}")]
        public async Task<ActionResult<ItemResponse<Transfer>>> Get(int transferId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Transfer transfer = await _service.GetTransferById(transferId);

                if (transfer == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Transfer> { Item = transfer };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("balance/{profileId:int}")]
        public async Task<ActionResult<ItemsResponse<List<Balance>>>> GetBalance(int profileId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Balance> balances = await _service.GetBalance(profileId);

                if (balances == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Balance> { Items = balances };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("{profileId:int}/payment/{transferId:int}")]
        public async Task<ActionResult<ItemResponse<Payment>>> Payment(PaymentAddRequest model, int profileId, int transferId)
        {
            ObjectResult result = null;

            try
            {
                Payment payment = await _service.Payment(model, profileId, transferId);
                ItemResponse<Payment> response = new ItemResponse<Payment>() { Item = payment };
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

        [HttpGet("{profileId:int}/payin/details/{transferId:int}")]
        public async Task<ActionResult<ItemResponse<PayinDetails>>> GetPayindDetails(int profileId, int transferId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                PayinDetails details = await _service.GetPayindDetails(profileId, transferId);

                if (details == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<PayinDetails> { Item = details };

                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<DbTransfer>>> GetPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<DbTransfer> page = _service.GetPage(pageIndex, pageSize, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<DbTransfer>> { Item = page };
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

        [HttpGet("recipients/{recipientId:int}")]
        public async Task<ActionResult<ItemResponse<Content>>> GetRecipient(int recipientId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Content recipient = await _service.GetRecipient(recipientId);

                if (recipient == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Content> { Item = recipient };
                }
            }
            catch (Exception ex)
            {

                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("quotes/{profileId:int}/{quoteId}")]
        public async Task<ActionResult<ItemResponse<TransferWiseQuote>>> GetQuote(int profileId, string quoteId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                TransferWiseQuote quote = await _service.GetQuote(profileId, quoteId);

                if (quote == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<TransferWiseQuote> { Item = quote };
                }
            }
            catch (Exception ex)
            {

                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("rate")]
        public async Task<ActionResult<ItemsResponse<List<CurrencyRate>>>> GetCurrecyRate(string currecy1, string currecy2)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<CurrencyRate> rate = await _service.GetCurrecyRate(currecy1, currecy2);

                if (rate == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<CurrencyRate> { Items = rate };
                }
            }
            catch (Exception ex)
            {

                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }
        [HttpGet("exchangeRates")] 
        public async Task<ActionResult<ItemResponse<ExchangeRate>>> GetAllExchangeRates(string symbols = null)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                ExchangeRate rates = await _service.GetExchangeRates(symbols);

                if (rates == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<ExchangeRate> { Item = rates };
                }
            }
            catch (Exception ex)
            {

                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }
        [HttpGet("historicalExchangeRates")]
        public async Task<ActionResult<ItemResponse<ExchangeRate>>> GetAllHistoricalExchangeRates(string date, string symbols = null)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                ExchangeRate rates = await _service.GetHistoricalExchangeRates(date, symbols);

                if (rates == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<ExchangeRate> { Item = rates };
                }
            }
            catch (Exception ex)
            {

                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

    }

 public class TransferWiseService : ITransferWiseService
    {
        IDataProvider _data = null;
        WiseKeys _wiseKeys = null;
        HttpClient _httpClient = null;
        ExchangeRateConfig _exchangeRate = null;
        HttpClient _httpClient2 = null;

        public TransferWiseService(IDataProvider data, IOptions<WiseKeys> options, IOptions<ExchangeRateConfig> options1)
        {
            _data = data;
            _wiseKeys = options.Value;
            _httpClient = GetClient();
            _exchangeRate = options1.Value;
            _httpClient2 = new HttpClient();
        }
        private HttpClient GetClient()

        {
            HttpClient httpClient = new HttpClient();

            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_wiseKeys.ApiKey}");

            return httpClient;
        }
        public async Task<List<WiseProfile>> GetProfiles()
        {
            List<WiseProfile> list = null;
            string path = "/v1/profiles";
            try
            { 
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                list = JsonConvert.DeserializeObject<List<WiseProfile>>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;       
            }
            return list;
        }
        public async Task<RecipientList> GetRecripients(string currency)
        {
            RecipientList list = null;
            string path = $"/v2/accounts/?currency={currency}";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                list = JsonConvert.DeserializeObject<RecipientList>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;       
            }
            return list;
        }

        public async Task<List<RecipientForm>> GetRecripientForm(string quouteId)
        {
            List<RecipientForm> list = null;
            string path = $"/v1/quotes/{quouteId}/account-requirements";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                list = JsonConvert.DeserializeObject<List<RecipientForm>>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return list;
        }

        public async Task<List<RecipientForm>> UpdateRecipientForm(object model, string quouteId)
        {
            List<RecipientForm> list = null;
            string path = $"/v1/quotes/{quouteId}/account-requirements";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Post, model);

                list = JsonConvert.DeserializeObject<List<RecipientForm>>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return list;
        }

        public async Task<TransferWiseQuote> CreateQuote(QuoteAddRequest request, int profileId)
        {
            TransferWiseQuote quote = null;
            string path = $"/v3/profiles/{profileId}/quotes";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Post, request);

                quote = JsonConvert.DeserializeObject<TransferWiseQuote>(responseBody);

            }
            catch (HttpRequestException ex)
            {   
                Console.WriteLine(ex.Message);
                throw;
            } 
            return quote;  
        }

        public async Task<int> CreateRecipient(object model)
        {
            int id = 0;
            string path = "/v1/accounts";
            try
        {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Post, model);

                JObject recipient = JObject.Parse(responseBody);

                id = recipient.Value<int>("id");

        }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return id;
        }

        public async Task<TransferForm> GetTransferForm(TransferAddRequest model)
        {
            List<TransferForm> form = null;
            string path = "/v1/transfer-requirements";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Post, model);

                form = JsonConvert.DeserializeObject<List<TransferForm>>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return form.First(); //response from the api comes back as array of one object so .first is needed to return the object
        }

        public async Task<Transfer> CreateTransfer(TransferAddRequest model, int userId)
        {
            Transfer transfer = null;
            string CustomerTransactionId = null;
            string path = "/v1/transfers";
            string procName = "WiseTransfers_Insert";
            string procNameTwo = "WiseTransfers_Update";
            try
            {
                _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@QuouteUuid", model.QuoteUuid);
                    collection.AddWithValue("@TargetAccount", model.TargetAccount);
                    collection.AddWithValue("@AmountSent", model.AmountSent);
                    collection.AddWithValue("@SourceCurrency", model.SourceCurrency);
                    collection.AddWithValue("@TargetCurrency", model.TargetCurrency);
                    collection.AddWithValue("@Status", model.Status);
                    collection.AddWithValue("@WiseProfileId", model.WiseProfileId);
                    collection.AddWithValue("@CreatedBy", userId);
                    SqlParameter transactionUuid = new SqlParameter("@CustomerTransactionId", SqlDbType.UniqueIdentifier);
                    transactionUuid.Direction = ParameterDirection.Output;
                    collection.Add(transactionUuid);
                }
                , returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@CustomerTransactionId"].Value;

                    CustomerTransactionId = oId.ToString();

                });

                model.CustomerTransactionId = CustomerTransactionId;

                string responseBody = await CommonHttpRequest(path, HttpMethod.Post, model);

                transfer = JsonConvert.DeserializeObject<Transfer>(responseBody);

                _data.ExecuteNonQuery(procNameTwo
                    ,inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@CustomerTransactionId", CustomerTransactionId);
                    collection.AddWithValue("@TransferId", transfer.Id);
                }, returnParameters: null
           );
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return transfer;
        }

        public async Task<Transfer> GetTransferById(int transferId)
        {
            Transfer transfer = null;
            string path = $"/v1/transfers/{transferId}";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                transfer = JsonConvert.DeserializeObject<Transfer>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return transfer;
        }

        public async Task<Transfer> SimulateStatus(int transferId, string status)
        {
            Transfer transfer = null;
            string path = $"/v1/simulation/transfers/{transferId}/{status}";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get); 

                transfer = JsonConvert.DeserializeObject<Transfer>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return transfer; 
        }

        public async Task<byte[]> GetReceipt(int transferId)
        {
            byte[] receipt = null;
            string path = $"{_wiseKeys.Url}/v1/transfers/{transferId}/receipt.pdf";
            try
            {
                receipt = await _httpClient.GetByteArrayAsync(path); 
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return receipt;
        }

        public async Task<List<Balance>> GetBalance(int profileId)
        {
            List<Balance> list = null;
            string path = $"/v4/profiles/{profileId}/balances?types=STANDARD";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                list = JsonConvert.DeserializeObject<List<Balance>>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return list;
        }

        public async Task<Payment> Payment(PaymentAddRequest model, int profileId, int transferId)
        {
            Payment payment = null;
            string path = $"/v3/profiles/{profileId}/transfers/{transferId}/payments";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Post, model);

                payment = JsonConvert.DeserializeObject<Payment>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return payment;
        }

        public async Task<PayinDetails> GetPayindDetails(int profileId, int transferId)
        {
            PayinDetails details = null;
            string path = $"/v1/profiles/{profileId}/transfers/{transferId}/deposit-details/bank-transfer";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                details = JsonConvert.DeserializeObject<PayinDetails>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return details;
        }

        public Paged<DbTransfer> GetPage(int pageIndex, int pageSize, int userId)
        {
            Paged<DbTransfer> pagedList = null;
            List<DbTransfer> list = null;
            int totalCount = 0;
            string procName = "WiseTransfers_SelectPaginated";

            _data.ExecuteCmd(procName,
               inputParamMapper: delegate (SqlParameterCollection collection)
               {
                   collection.AddWithValue("@PageIndex", pageIndex);
                   collection.AddWithValue("@PageSize", pageSize);
                   collection.AddWithValue("@UserId", userId);
               }
               , delegate (IDataReader reader, short set)
               {
                   int startingIndex = 0;
                   DbTransfer transfer = MapSingleTransfer(reader, ref startingIndex);
                   totalCount = reader.GetSafeInt32(startingIndex);
                   if (list == null)
                   {
                       list = new List<DbTransfer>();
                   }
                   list.Add(transfer);
               });

            if (list != null)
            {
                pagedList = new Paged<DbTransfer>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public async Task<Content> GetRecipient(int recipientId)
        {
            Content recipient = null;
            string path = $"/v2/accounts/{recipientId}";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                recipient = JsonConvert.DeserializeObject<Content>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return recipient;
        }

        public async Task<TransferWiseQuote> GetQuote(int profileId, string quoteId)
        {
            TransferWiseQuote quote = null;
            string path = $"/v3/profiles/{profileId}/quotes/{quoteId}";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                quote = JsonConvert.DeserializeObject<TransferWiseQuote>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return quote;
        }

        public async Task<List<CurrencyRate>> GetCurrecyRate(string currecy1, string currecy2)
        {
            List<CurrencyRate> list = null;
            string path = $"/v1/rates?source={currecy1}&target={currecy2}";
            try
            {
                string responseBody = await CommonHttpRequest(path, HttpMethod.Get);

                list = JsonConvert.DeserializeObject<List<CurrencyRate>>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return list;
        }

        public async Task<ExchangeRate> GetExchangeRates(string symbols = null)
        {
            ExchangeRate exchangeRate = null;
            string path = null;
            if (symbols !=  null)
            {
                path = $"/v1/latest?api_key={_exchangeRate.ApiKey}&base=USD&symbols={symbols}";
            }
            else
            {
                path = $"/v1/latest?api_key={_exchangeRate.ApiKey}&base=USD";
            }
            try
            {
                string responseBody = await ExchangeHttpRequest(path, HttpMethod.Get);

                exchangeRate = JsonConvert.DeserializeObject<ExchangeRate>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return exchangeRate;
        }

        public async Task<ExchangeRate> GetHistoricalExchangeRates(string date ,string symbols = null)
        {
            ExchangeRate exchangeRate = null;
            string path = null;
            if (symbols != null)
            {
                path = $"/v1/historical?api_key={_exchangeRate.ApiKey}&base=USD&date={date}&symbols={symbols}";
            }
            else
            {
                path = $"/v1/historical?api_key={_exchangeRate.ApiKey}&base=USD&date={date}";
            }
            try
            {
                string responseBody = await ExchangeHttpRequest(path, HttpMethod.Get);

                exchangeRate = JsonConvert.DeserializeObject<ExchangeRate>(responseBody);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            return exchangeRate;
        }

        private async Task<string> CommonHttpRequest(string path, HttpMethod httpMethod, object request = null)
        {
            string responseBody = null;

            HttpRequestMessage msg = new HttpRequestMessage(httpMethod, $"{_wiseKeys.Url}{path}");//set path and https method

            if(request != null)
            {
                string requestBody = JsonConvert.SerializeObject(request);

                msg.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            }
            try
            {
                HttpResponseMessage rmsg = await _httpClient.SendAsync(msg);

                rmsg.EnsureSuccessStatusCode();

                responseBody = await rmsg.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

            return responseBody;
        }

        private async Task<string> ExchangeHttpRequest(string path, HttpMethod httpMethod)
        {
            string responseBody = null;
            HttpRequestMessage msg = new HttpRequestMessage(httpMethod, $"{_exchangeRate.Url}{path}");

            try
            {
                HttpResponseMessage rmsg = await _httpClient2.SendAsync(msg);

                rmsg.EnsureSuccessStatusCode();

                responseBody = await rmsg.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

            return responseBody;
        }

        private static DbTransfer MapSingleTransfer(IDataReader reader, ref int startingIndex)
        {
            DbTransfer transfer = new DbTransfer();
            transfer.CustomerTransactionId = reader.GetSafeGuid(startingIndex++);
            transfer.QuouteUuid = reader.GetSafeString(startingIndex++);
            transfer.TargetAccount = reader.GetSafeInt32(startingIndex++);
            transfer.TransferId = reader.GetSafeInt32(startingIndex++);
            transfer.AmountSent = reader.GetSafeDouble(startingIndex++);
            transfer.SourceCurrency = reader.GetSafeString(startingIndex++);
            transfer.TargetCurrency = reader.GetSafeString(startingIndex++);
            transfer.Status = reader.GetSafeString(startingIndex++);
            transfer.AmountReceived = reader.GetSafeDouble(startingIndex++);
            transfer.WiseProfileId = reader.GetSafeInt32(startingIndex++);
            transfer.CreatedBy = reader.GetSafeInt32(startingIndex++);
            transfer.DateCreated = reader.GetSafeDateTime(startingIndex++);
            return transfer;
        }
    }

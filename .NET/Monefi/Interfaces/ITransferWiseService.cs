public interface ITransferWiseService
    {
        Task<List<WiseProfile>> GetProfiles();
        Task<TransferWiseQuote> CreateQuote(QuoteAddRequest request, int profileId);
        Task<RecipientList> GetRecripients(string currency);
        Task<List<RecipientForm>> GetRecripientForm(string quouteId);
        Task<List<RecipientForm>> UpdateRecipientForm(object model, string quouteId);
        Task<int> CreateRecipient(object requestBody);
        Task<TransferForm> GetTransferForm(TransferAddRequest model);
        Task<Transfer> CreateTransfer(TransferAddRequest model, int userId);
        Task<Transfer> SimulateStatus(int transferId, string status);
        Task<byte[]> GetReceipt(int transferId);
        Task<Transfer> GetTransferById(int transferId);
        Task<List<Balance>> GetBalance(int profileId);
        Task<Payment> Payment(PaymentAddRequest model, int profileId, int transferId);
        Task<PayinDetails> GetPayindDetails(int profileId, int transferId);
        Paged<DbTransfer> GetPage(int pageIndex, int pageSize, int userId);
        Task<Content> GetRecipient(int recipientId);
        Task<TransferWiseQuote> GetQuote(int profileId, string quoteId);
        Task<List<CurrencyRate>> GetCurrecyRate(string currecy1, string currecy2);
        Task<ExchangeRate> GetExchangeRates(string symbols = null);
        Task<ExchangeRate> GetHistoricalExchangeRates(string date, string symbols = null); 
    }

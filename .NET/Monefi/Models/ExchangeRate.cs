public class ExchangeRate
    {
        public DateTime Date { get; set; }
        public string Base { get; set; }
        public Dictionary<string, double> Rates { get; set; }
    }

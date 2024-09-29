namespace PeerLandingFE.DTO.Req
{
    public class ReqAddPaymentDto
    {
        public decimal Amount { get; set; }
        public decimal RepaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public string RepaidStatus { get; set; }
        public DateTime PaidAt { get; set; }
    }
}

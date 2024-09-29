namespace PeerLandingFE.DTO.Res
{
    public class ResBorrowerDto
    {
        public string Id { get; set; }
        public string Borrower { get; set; }
        public decimal Amount { get; set; }
        public decimal InterestRate { get; set; }
        public int Duration { get; set; }
        public string Status { get; set; }
    }
}

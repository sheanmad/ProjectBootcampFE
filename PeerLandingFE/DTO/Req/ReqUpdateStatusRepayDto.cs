namespace PeerLandingFE.DTO.Req
{
    public class ReqUpdateStatusRepayDto
    {
        public string Status { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

    }
}

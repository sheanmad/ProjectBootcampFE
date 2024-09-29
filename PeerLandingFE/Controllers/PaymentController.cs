using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class PaymentController : Controller
    {
        public IActionResult Index(string loanId)
        {
            ViewBag.LoanId = loanId;
            return View();
        }
    }
}

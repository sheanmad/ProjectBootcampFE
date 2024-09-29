using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using System.Net.Http.Headers;

namespace PeerLandingFE.Controllers.api
{
    public class ApiPaymentController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiPaymentController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpGet]
        public async Task<IActionResult> GetLoanRepaidByLoanId(string id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7191/rest/v1/borrower/GetLoanRepaidByLoanId/{id}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Fetch Data failed.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetLastPaymentByLoanId(string id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7191/rest/v1/borrower/GetLastPaymentByLoanId/{id}");
            
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(new { success = true, message = "Last payment retrieved successfully", data = responseData });
            }
            else
            {
                return BadRequest(new { success = false, message = "Failed to fetch last payment data" });
            }
        }


        [HttpPost]
        public async Task<IActionResult> AddPayment(string id, [FromBody] ReqAddPaymentDto reqAddPayment)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.PostAsJsonAsync($"https://localhost:7191/rest/v1/borrower/AddPayment/{id}", reqAddPayment);

            if (response.IsSuccessStatusCode)
            {
                return Ok(await response.Content.ReadAsStringAsync());
            }
            else
            {
                return BadRequest("Failed to add payment.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSaldoPaymentBorrower(string id, [FromBody] ReqUpdateAmountDto reqUpdateAmount)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.PutAsJsonAsync($"https://localhost:7191/rest/v1/borrower/UpdateSaldoPaymentBorrower/{id}", reqUpdateAmount);

            if (response.IsSuccessStatusCode)
            {
                return Ok(await response.Content.ReadAsStringAsync());
            }
            else
            {
                return BadRequest("Failed to update borrower balance.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSaldoPaymentLender(string id, [FromBody] ReqUpdateAmountDto reqUpdateAmount)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.PutAsJsonAsync($"https://localhost:7191/rest/v1/borrower/UpdateSaldoPaymentLender/{id}", reqUpdateAmount);

            if (response.IsSuccessStatusCode)
            {
                return Ok(await response.Content.ReadAsStringAsync());
            }
            else
            {
                return BadRequest("Failed to update lender balance.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateStatusRepay(string id, [FromBody] ReqUpdateStatusRepayDto reqUpdateStatusRepay)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.PutAsJsonAsync($"https://localhost:7191/rest/v1/borrower/UpdateStatusRepay/{id}", reqUpdateStatusRepay);

            if (response.IsSuccessStatusCode)
            {
                return Ok(await response.Content.ReadAsStringAsync());
            }
            else
            {
                return BadRequest("Failed to update loan status.");
            }
        }
    }
}

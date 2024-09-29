using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.api
{
    public class ApiLenderController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiLenderController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllBorrower()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync("https://localhost:7191/rest/v1/lender/GetAllBorrowers");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Login failed.");
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateStatusLoan(string id, [FromBody] ReqUpdateLoanDto reqUpdateLoanDto)
        {
            if (reqUpdateLoanDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqUpdateLoanDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7191/rest/v1/lender/UpdateStatusLoan/{id}", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to update user.");
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateSaldoTransaksiLender(string lenderId, [FromBody] ReqUpdateAmountDto reqUpdateAmountDto)
        {
            Console.WriteLine(JsonSerializer.Serialize(reqUpdateAmountDto));
            if (reqUpdateAmountDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqUpdateAmountDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7191/rest/v1/lender/UpdateSaldoTransaksiLender/{lenderId}", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to update lender saldo.");
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateSaldoTransaksiBorrower(string id, [FromBody] ReqUpdateAmountDto reqUpdateAmountDto)
        {
            if (reqUpdateAmountDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqUpdateAmountDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7191/rest/v1/lender/UpdateSaldoTransaksiBorrower/{id}", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to update borrower saldo.");
            }
        }
    }
}

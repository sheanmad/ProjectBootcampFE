namespace PeerLandingFE.DTO.Res
{
    public class ResLoginDto
    {
        public class LoginResponse
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            public UserData Data { get; set; }
            public class UserData
            {
                public int Id { get; set; }
                public string Name { get; set; }
                public string Email { get; set; }
                public string Role { get; set; }
                public string Token { get; set; }
            }
        }
    }
}

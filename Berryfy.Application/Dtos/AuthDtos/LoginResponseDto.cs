namespace Berryfy.Application.Dtos.AuthDtos
{
    public class LoginResponseDto
    {
        public ApplicationUserDto User { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public string ErrorMessage { get; set; }
    }
}

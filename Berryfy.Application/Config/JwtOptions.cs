namespace Berryfy.Application.Config
{ 
    public class JwtOptions
    {
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public bool RequireHttps { get; set; }
    }
}

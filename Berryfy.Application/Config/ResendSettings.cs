namespace Berryfy.Application.Config
{
    public class ResendSettings
    {
        public const string Name = "ResendSettings";

        public string ApiKey { get; set; } = string.Empty;
        public string From { get; set; } = "support@berryfy.org";
    }
}

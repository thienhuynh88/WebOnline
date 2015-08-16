namespace TPF.Common.Authentication
{
    public class UserLoginInfo
    {
        public long UserId { get; set; }
        public string Password { get; set; }
        public string UserName{ get; set; }
        public string Email { get; set; }

        public string Name { get; set; }

        public UserLoginInfo()
        {
        }
    }
}

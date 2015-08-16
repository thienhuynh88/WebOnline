namespace TPF.Common.Authentication
{
    public enum EUserAuthorizeResult
    {
        None,
        Successful,
        IncorrectUserNameOrPassword,
        Deleted,
        Blocked
    }
}

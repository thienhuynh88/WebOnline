using System.Web;
using System.Web.Caching;
using System.Web.Security;
using System.Web.SessionState;
using TPF.Common.Authentication;
using TPF.Common.LogService;
namespace WebOnline.Business.Authentication
{
    public static class AdminManager
    {
        static readonly object Lock = new object();

        public static HttpSessionState Session
        {
            get { return HttpContext.Current.Session; }
        }

        private const string ConstUserLoginInfo = "ConstUserLoginInfo";
        public static UserLoginInfo UserLoginInfo
        {
            get
            {
                // if FormsAuthenticationTicket is valid and 'CurrentAdmin' Session is null, will get Data and assign to it.
                if (HttpContext.Current.Request.IsAuthenticated)
                {
                    if (Session[ConstUserLoginInfo] == null)
                    {
                        lock (Lock)
                        {
                            if (Session[ConstUserLoginInfo] == null)
                            {
                                var userLoginInfo = new FormsAuthenticationService().GetUserLoginInfo();
                                if (userLoginInfo != null)
                                {
                                    Session[ConstUserLoginInfo] = userLoginInfo;
//#if DEBUG
//                                    //Logger.DefaultLogger.Error("AdminManager_UserLoginInfo: User Is Authenticated && Get UserLoginInfo: " + (userLoginInfo == null ? "fail" : "success"));
//#endif
                                }
                                else
                                {
                                    HttpContext.Current.Response.Redirect("~/Account/logoff");
                                }
                            }
                        }
                    }
                }
                else
                {
                    Session.Remove(ConstUserLoginInfo);
                }

                return Session[ConstUserLoginInfo] as UserLoginInfo;
            }
            set
            {
                Session[ConstUserLoginInfo] = value;
            }
        }

        public static bool SetUserLoginInfoForCrossSubDomain()
        {
            var userLoginInfo = new FormsAuthenticationService().GetUserLoginInfo(false);
            if (userLoginInfo != null)
            {
                Session[ConstUserLoginInfo] = userLoginInfo;
                // ghi nhận cookie cho FormAuthentication
                FormsAuthentication.SetAuthCookie(userLoginInfo.UserName, true);

                //FormsAuthenticationTicket authTicket = null;
                //authTicket = FormsAuthentication..Decrypt(userLoginInfo.UserName);
                //string[] roles = userLoginInfo.UserName.Split(',');
                //HttpContext.Current.User =new System.Security.Principal.GenericPrincipal(new FormsIdentity(authTicket), roles);
               // Logger.DefaultLogger.Error("login line 74");
                return true;
            }
           // Logger.DefaultLogger.Error("login line 77");
            return false;
        }

        public static void Clear()
        {
            FormsAuthenticationService.ClearCookieForCrossSubDomain();
            Session.Remove(ConstUserLoginInfo);
            Session.Abandon();
        }
    }
}
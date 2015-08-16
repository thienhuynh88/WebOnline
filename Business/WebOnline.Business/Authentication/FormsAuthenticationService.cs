using System;
using WebOnline.Business.Services;
using System.Web;
using System.Web.Security;
using TPF.Common.Authentication;
using TPF.Common.Utils;

namespace WebOnline.Business.Authentication
{
    public class FormsAuthenticationService
    {
        //private IStaffService _staffService;
        //public IStaffService StaffService
        //{
        //    get { return _staffService ?? (_staffService = new StaffService()); }
        //    set { _staffService = value; }
        //}

        private IStaffService1 _staffService;
        public IStaffService1 StaffService
        {
            get { return _staffService ?? (_staffService = new StaffService1()); }
            set { _staffService = value; }
        }

        public EUserAuthorizeResult SignIn(string username, string password, bool createPersistentCookie = false)
        {
            var authorizeResult = EUserAuthorizeResult.IncorrectUserNameOrPassword;
            //password = Cryptography.MD5(password);

            var user = StaffService.StaffLogin(username);

            if (user == null) return authorizeResult;
            if (user.Password != password)
            {
                authorizeResult = EUserAuthorizeResult.IncorrectUserNameOrPassword;
            }
            else
            {
                authorizeResult = EUserAuthorizeResult.Successful;
            }
          

            return authorizeResult;
        }

        public void SignOut()
        {
            FormsAuthentication.SignOut();
            HttpContext.Current.Session.Abandon();
        }

        /// <summary>
        /// Get UserLoginInfo from Form Cookie via Ticket
        /// </summary>
        /// <returns></returns>
        public UserLoginInfo GetUserLoginInfo(bool isFormsAuthenticationTicket = true)
        {
            // get FormsAuthentication Cookie
            var cookieName = isFormsAuthenticationTicket ? FormsAuthentication.FormsCookieName : CookieNameForCrossSubDomain;
            var authCookie = HttpContext.Current.Request.Cookies[cookieName];

            if (authCookie != null && !string.IsNullOrEmpty(authCookie.Value))
            {
                var userName = "";

                if (isFormsAuthenticationTicket)
                {
                    // create FormsAuthenticationTicket from cookie
                    var authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                    if (authTicket != null)
                    {
                        userName = authTicket.Name;
                    }
                }
                else
                {
                    userName = authCookie.Value;
                }

                if (!string.IsNullOrEmpty(userName))
                {
                    // get Admin object from userName
                    var user = StaffService.StaffLogin(userName);
                    if (user != null)
                    {

                        return new UserLoginInfo
                        {
                            UserId = user.ID,
                            UserName = user.Username1,
                            Password = user.Password,
                            Name = user.Fname + " " + user.Lname
                          
                        };
                    }
                }
            }

            return null;
        }

        public const string CookieNameForCrossSubDomain = "CookieNameForCrossSubDomain";
        public static void SetCookieForCrossSubDomain(string username)
        {
            var acrossSubDomain = new HttpCookie(CookieNameForCrossSubDomain);
            acrossSubDomain.Value = username;
            acrossSubDomain.Domain = FormsAuthentication.CookieDomain;
            HttpContext.Current.Response.Cookies.Add(acrossSubDomain);
        }

        public static void ClearCookieForCrossSubDomain()
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[CookieNameForCrossSubDomain];
            if (cookie != null)
            {
                cookie.Expires = DateTime.Now.AddDays(-2);
                cookie.Domain = FormsAuthentication.CookieDomain;
                cookie.Value = "";
                HttpContext.Current.Response.Cookies.Add(cookie);
            }
        }

        #region FormsAuthenticationTicket
        /*
        /// <summary>
        /// Fires when Login button will be clicked
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Login1_Authenticate(object sender, AuthenticateEventArgs e)
        {
            string userName = Login1.UserName;
            string password = Login1.Password;
            bool rememberUserName = Login1.RememberMeSet;

            // get the role now
            string roles = rows[0]["Roles"].ToString();

            // Create forms authentication ticket
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
            1, // Ticket version
            userName,// Username to be associated with this ticket
            DateTime.Now, // Date/time ticket was issued
            DateTime.Now.AddMinutes(50), // Date and time the cookie will expire
            rememberUserName, // if user has chcked rememebr me then create persistent cookie
            roles, // store the user data, in this case roles of the user
            FormsAuthentication.FormsCookiePath); // Cookie path specified in the web.config file in <Forms> tag if any.

            // To give more security it is suggested to hash it
            string hashCookies = FormsAuthentication.Encrypt(ticket);
            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, hashCookies); // Hashed ticket
            
            // Add the cookie to the response, user browser
            Response.Cookies.Add(cookie);

            // Get the requested page from the url
            string returnUrl = Request.QueryString["ReturnUrl"];
            // check if it exists, if not then redirect to default page
            if (returnUrl == null) returnUrl = "~/Default.aspx";
            Response.Redirect(returnUrl);
        }*/
        #endregion
    }
}

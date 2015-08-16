using System.Web.Mvc;
using System.Web.Security;
using WebOnline.Business.Authentication;
using WebOnline.Web.Models;
using TPF.Common.Authentication;
using TPF.Common.LogService;

namespace WebOnline.Web.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {

        #region Variables & Constructors
        private FormsAuthenticationService _formsAuthServicee;
        private FormsAuthenticationService FormsAuthService
        {
            get { return _formsAuthServicee ?? (_formsAuthServicee = new FormsAuthenticationService()); }
            set { _formsAuthServicee = value; }
        }
        #endregion

        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            Logger.DefaultLogger.Error("login line 26");

            if (Request.IsAuthenticated) //
                return Redirect("/Home");

            // TODO: chead code - get cookie và set cho FormAuthentication cho trường hợp cross subdomain, vì hiện tại khác version .net
            if (AdminManager.SetUserLoginInfoForCrossSubDomain())
            {
                Logger.DefaultLogger.Error("login line 34");
                return Redirect("/Home");
            }

            var model = new LoginViewModel
            {
                ReturnUrl = returnUrl
            };
            return View(model);
        }

        public ActionResult TestView()
        {
            return View();
        }

        //
        // POST: /Account/Login

        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var userAuthorizeResult = FormsAuthService.SignIn(model.UserName, model.Password, model.RememberMe);

                if (userAuthorizeResult == EUserAuthorizeResult.Successful)
                {
                    FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);

                    // TODO: chead code - set cookie cho trường hợp cross subdomain, vì hiện tại khác version .net
                    FormsAuthenticationService.SetCookieForCrossSubDomain(model.UserName);

                    if (Url.IsLocalUrl(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }

                if (userAuthorizeResult == EUserAuthorizeResult.IncorrectUserNameOrPassword)
                {
                    ModelState.AddModelError("", "Username or a password is incorrect.");
                }
                else if (userAuthorizeResult == EUserAuthorizeResult.Blocked)
                {
                    ModelState.AddModelError("", "Error is not expected.");
                }
            }

            // If we got this far, something failed, redisplay form
            return PartialView(model);
        }

        //
        // GET: /Account/LogOff

        public ActionResult LogOff()
        {
            // bat buoc phai co
            AdminManager.Clear();
            FormsAuthService.SignOut();

            return RedirectToAction("Index", "Home");
        }
    }
}
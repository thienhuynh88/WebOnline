using System.Web;
using System.Web.Mvc;
using TPF.Common.LogService;

namespace Royalty.Web.Utility.FilterAttributes
{
    public class CustomHandleErrorAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            //filterContext.HttpContext.IsCustomErrorEnabled

            // only call when custom error is off
            // nếu trong mỗi action đã dùng try/cach để handle error, thì sẽ không làm gì
            if (filterContext.ExceptionHandled)
                return;

            //1. LogError
            Logger.DefaultLogger.Error(filterContext.Exception);

            #region 2. Redirect to the error page if exception wasn't handled yet.
            /*
         Note: If none of the exception filters for an action method set the ExceptionHandled property to true, 
            the MVC Framework uses the default ASP.NET exception handling procedure. 
            This will display the dreaded yellow screen of death by default.
                  
         * Lưu ý: Hiện tại trong mỗi controller đều khai báo atrribute [CustomHandleError]
            Nếu trong mỗi action chúng ta không dùng try-catch để handle error, thì mặc định sẽ vô hàm này
            Nếu set ExceptionHandled = false --> sẽ văng ra trang vàng lỗi
            Ngược lại ExceptionHandled = true -> sẽ nhảy vô trang error  "/Error/SpecialErrorPage"
         */

            if (HttpContext.Current.IsDebuggingEnabled)
            {
                filterContext.ExceptionHandled = false;
            }
            else
            {
                var model = new HandleErrorInfo(filterContext.Exception, filterContext.RouteData.Values["controller"].ToString(), filterContext.RouteData.Values["action"].ToString());
                var result = new ViewResult
                {
                    ViewName = "~/Views/Shared/Error.cshtml",
                    ViewData = new ViewDataDictionary<HandleErrorInfo>(model),
                };

                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    // the controller action was invoked with an AJAX request
                    result.ViewName = "~/Views/Shared/ErrorAjax.cshtml";
                }
                filterContext.Result = result;

                filterContext.ExceptionHandled = true;
            }

            #endregion

            //2. maybe send mail to admin

        }
    }
}

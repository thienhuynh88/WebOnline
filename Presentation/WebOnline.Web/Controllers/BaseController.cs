using Royalty.Web.Utility.FilterAttributes;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;


namespace WebOnline.Web.Controllers
{
    [CustomHandleError]
    public class BaseController : Controller
    {
        #region ModelState

        protected List<string> GetErrorsFromModelState()
        {
            return ModelState.SelectMany(x => x.Value.Errors.Select(error => error.ErrorMessage)).ToList();
        }

        protected void RemoveErrosFromModelState(params string[] fieldnames)
        {
            foreach (var fieldname in fieldnames)
            {
                ModelState.Remove(fieldname);
            }
        }

        #endregion

        #region RenderRazor
        protected string RenderRazorPartialViewToString(string partialViewName, object model = null)
        {
            using (var sw = new StringWriter())
            {
                if (model != null) ViewData.Model = model;
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, partialViewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }
        protected string RenderRazorViewToString(string viewName, string masterName, object model = null)
        {
            using (var sw = new StringWriter())
            {
                if (model != null) ViewData.Model = model;
                var viewResult = ViewEngines.Engines.FindView(ControllerContext, viewName, masterName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }
        #endregion

        public ActionResult Error()
        {
            return View();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebOnline.Web.Controllers;

namespace Royalty.Web.Controllers
{
     [Authorize]
    public class OrderController : BaseController
    {
         public ActionResult OrderList()
         {
             return View();
         }

         public ActionResult OrderNew()
         {
             return View();
         }
	}
}
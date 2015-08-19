using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebOnline.Web.Controllers;

namespace Royalty.Web.Controllers
{
     [Authorize]
    public class UsersController : BaseController
    {
        public ActionResult DetailUser(int id=0)
        {
             return View();
        }
	}
}
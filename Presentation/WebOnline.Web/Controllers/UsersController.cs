using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebOnline.Business.Authentication;
using WebOnline.Business.Models;
using WebOnline.Business.Services;
using WebOnline.Web.Controllers;

namespace Royalty.Web.Controllers
{
    [Authorize]
    public class UsersController : BaseController
    {

        #region Variables & Constructors
        private IUserService _userService;
        private IUserService UserService
        {
            get { return _userService ?? (_userService = new UserService()); }
            set { _userService = value; }
        }
        #endregion

        #region Detail User
        public ActionResult DetailUser(int id = 0)
        {

            var model = UserService.GetUserNameByID(id);
            if (model.ID == 0)
            {
                model.DeptID = 3;
                model.Status = 1;
            }
            return View(model);
        }

        [HttpPost]
        public ActionResult SaveDataUserName(UserNameModel data)
        {
            var userId = AdminManager.UserLoginInfo.UserId;
            data.Createby = (int)userId;
            data.Updateby = (int)userId;
            data.Createday = DateTime.Now;
            data.Updateday = DateTime.Now;
            var result = UserService.SaveDataUserName(data);
            return Json(result);
        }

        #endregion

        #region List User

        public ActionResult ListUsers()
        {
            return View();
        }

        public ActionResult GetListDataUsersJson(string txtsearch, int status, int deptID)
        {
            var model = UserService.GetListUsers(txtsearch, status, deptID).ToList();
            return Json(new
            {
                TotalItems = model.Count(),
                Data = model.ToList()
            });
        }

        #endregion

        #region Dispose
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userService != null)
                {
                    _userService.Dispose();
                }
            }
            base.Dispose(disposing);
        }
        #endregion
    }
}
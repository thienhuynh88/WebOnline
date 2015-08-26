using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using Royalty.Data.Models;
using System;
using System.Linq;
using WebOnline.Business.Models;


namespace WebOnline.Business.Services
{
    public class UserService : IUserService
    {
        #region Variables and Constructors
        private THIENHUYNHDBEntities _context;
        public UserService()
        {
            _context = new THIENHUYNHDBEntities();
        }

        public UserService(THIENHUYNHDBEntities context)
        {
            _context = context;
        }
        
        public void SetProxyCreationEnabled(bool proxyCreationEnabled)
        {
            _context.Configuration.ProxyCreationEnabled = proxyCreationEnabled;
        }
        #endregion

        #region Public Methods

        #region Detail
        public UserNameModel GetUserNameByID(int id)
        {
            var model = new UserNameModel();
            if (id > 0)
            {
                var data = _context.UserNames.Find(id);
                model = UserNameModel.Parser(data);
                
            }
            return model;

        }

        public int SaveDataUserName(UserNameModel data)
        {
            try
            {
                if (data.ID > 0)
                {
                    var olduser = _context.UserNames.Find(data.ID);
                    if (olduser != null)
                    {
                        olduser.Fname = data.Fname ?? "";
                        olduser.Lname = data.Lname ?? "";
                        olduser.Username1 = data.Username1 ?? "";
                        olduser.Password = data.Password ?? "";
                        olduser.Email = data.Email ?? "";
                        olduser.Sex = data.Sex;
                        olduser.Birthdate = data.Birthdate ?? DateTime.Now;
                        olduser.Phone = data.Phone ?? "";
                        olduser.Mobile = data.Mobile ?? "";
                        olduser.Address1 = data.Address1 ?? "";
                        olduser.Address2 = data.Address2 ?? "";
                        olduser.Address3 = data.Address3 ?? "";
                        olduser.Country = data.Country ?? "";
                        olduser.Status = data.Status;
                        olduser.Note = data.Note ?? "";
                        olduser.DeptID = data.DeptID;
                        olduser.Updateby = data.Updateby;
                        olduser.Updateday = data.Updateday;


                        _context.Entry(olduser).State = EntityState.Modified;
                        _context.SaveChanges();
                        return olduser.ID;
                    }
                    return 0;
                }
                else
                {
                    var model = data.ToModel();
                    _context.Entry(model).State = EntityState.Added;
                    _context.SaveChanges();
                    return model.ID;
                }
                
            }
            catch (Exception)
            {
                return 0;
            }
           
           
        }

        #endregion


        public IEnumerable<UserNameModel> GetListUsers(string txtsearch, int status, int deptID)
        {
            if (string.IsNullOrEmpty(txtsearch))
            {
                txtsearch = "";
            }
            var data = _context.Database.SqlQuery<UserNameModel>("exec th_GetListDataUsers @txtsearch,@Status,@DeptID",
                new SqlParameter("txtsearch", txtsearch),
                new SqlParameter("Status", status),
                new SqlParameter("DeptID", deptID)
              ).ToList();
            return data;
        }

        #endregion

        #region Dispose
        private bool disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    // code is here
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}
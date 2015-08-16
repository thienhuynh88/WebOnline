using Royalty.Data.Models;
using System;
using System.Linq;



namespace WebOnline.Business.Services
{
    public class StaffService1 : IStaffService1
    {
        #region Variables and Constructors
        private THIENHUYNHDBEntities _context;
        public StaffService1()
        {
            _context = new THIENHUYNHDBEntities();
        }

        public StaffService1(THIENHUYNHDBEntities context)
        {
            _context = context;
        }
        
        public void SetProxyCreationEnabled(bool proxyCreationEnabled)
        {
            _context.Configuration.ProxyCreationEnabled = proxyCreationEnabled;
        }
        #endregion

        #region Public Methods
        public UserName StaffLogin(string username)
        {
            return _context.UserNames.FirstOrDefault(x => x.Username1 == username && x.Status==1);
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
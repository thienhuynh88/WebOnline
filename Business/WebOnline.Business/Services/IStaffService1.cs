using Royalty.Data.Models;
using System;
using System.Collections.Generic;


namespace WebOnline.Business.Services
{
    public interface IStaffService1 : IDisposable
    {
        UserName StaffLogin(string username);
        void SetProxyCreationEnabled(bool proxyCreationEnabled);

    }
}

using Royalty.Data.Models;
using System;
using System.Collections.Generic;
using WebOnline.Business.Models;


namespace WebOnline.Business.Services
{
    public interface IUserService : IDisposable
    {
        UserNameModel GetUserNameByID(int id);
        int SaveDataUserName(UserNameModel data);

        IEnumerable<UserNameModel> GetListUsers(string txtsearch, int status, int deptID);
        void SetProxyCreationEnabled(bool proxyCreationEnabled);

    }
}

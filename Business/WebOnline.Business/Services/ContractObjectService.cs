using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Royalty.Business.Models;
using Royalty.Data.RoyaltyModels;


namespace Royalty.Business.Services
{
    public class ContractObjectService : IContractObjectService
    {
        #region Variables and Constructors
        private RoyaltyEntities _context;
        public ContractObjectService()
        {
            _context = new RoyaltyEntities();
        }

        public ContractObjectService(RoyaltyEntities context)
        {
            _context = context;
        }

        public void SetProxyCreationEnabled(bool proxyCreationEnabled)
        {
            _context.Configuration.ProxyCreationEnabled = proxyCreationEnabled;
        }
        #endregion

        #region function

        #region Contract Object
        public IEnumerable<AvailableRightModel> GetListContractObject(int type, bool status = false)
        {
            if (!status)
            {
                return _context.AvailableRights.Where(x => x.ObjectTypeID == type)
                           .Select(p => new AvailableRightModel
                              {
                                  ID = p.ID,
                                  Name = p.Name,
                                  Description = p.Description,
                                  IsActive = p.IsActive
                             });

            }

            return _context.AvailableRights.Where(x => x.ObjectTypeID == type && x.IsActive)
                    .Select(p => new AvailableRightModel
                       {
                           ID = p.ID,
                           Name = p.Name,
                           Description = p.Description,
                           IsActive = p.IsActive
                       });
        }
        public AvailableRightModel CreateContractObject(AvailableRightModel data)
        {
            var contractobject = data.ToModel();
            contractobject.LastUpdateDate = DateTime.Now;
            _context.AvailableRights.Add(contractobject);
            _context.SaveChanges();
            data.ID = contractobject.ID;
            return data;
        }
        public AvailableRightModel UpdateContractObject(AvailableRightModel data)
        {
            var contractobject = _context.AvailableRights.Find(data.ID);

            contractobject.Name = data.Name;
            contractobject.Description = data.Description;
            contractobject.IsActive = data.IsActive;
            contractobject.LastUpdateDate = DateTime.Now;

            _context.Entry(contractobject).State = EntityState.Modified;
            _context.SaveChanges();

            return data;
        }
        public IEnumerable<AvailableRightModel> GetContractObjectById(int id)
        {
            var data = _context.AvailableRights.Where(x => x.ID == id).Select(y => new AvailableRightModel
                                                                                 {
                                                                                     ID = y.ID,
                                                                                     Name = y.Name,
                                                                                     Description = y.Description,
                                                                                     IsActive = y.IsActive,
                                                                                     CreatedBy = y.CreatedBy,
                                                                                     ObjectTypeId = y.ObjectTypeID
                                                                                 }).ToList();

            return data;
        }
        public int InsertContractObject(AvailableRightModel data)
        {

            var contractobject = data.ToModel();
            contractobject.LastUpdateDate = DateTime.Now;
            _context.AvailableRights.Add(contractobject);
            var i = _context.SaveChanges();
            return i;
        }
        public int UpdateContractObjectById(AvailableRightModel data)
        {
            var contractobject = _context.AvailableRights.Find(data.ID);

            contractobject.Name = data.Name;
            contractobject.Description = data.Description;
            contractobject.IsActive = data.IsActive;
            contractobject.LastUpdateDate = DateTime.Now;
            _context.Entry(contractobject).State = EntityState.Modified;
            var i = _context.SaveChanges();
            return i;
        }

        #endregion

        #region ContractParty

        public IEnumerable<SelectModel> GetDataContractParty()
        {
            var data = _context.ContractParties
                .Where(y => y.IsActive == true)
                .Select(x => new SelectModel
                {
                    Key = x.ID,
                    Value = x.CompanyName
                });
            return data;
        }

        public ContractPartyModel GetDataContractPartyById(long id)
        {
            var data = _context.ContractParties.Find(id);
            var model = ContractPartyModel.Parser(data);
            return model;
        }

        //public IEnumerable<SelectModel> GetListDataBanks()
        //{
        //    var data = _context.Banks.Where(x => x.Status == true).OrderBy(x => x.BankName)
        //        .Select(x => new SelectModel
        //        {
        //            Key = (int)x.BankID,
        //            Value = x.BankName
        //        });
        //    return data;
        //}

        #endregion

        #region Entity & 

        public IEnumerable<SelectModel> GetEntityContract()
        {
            return _context.th_sp_GetEntityFromCompanyFinanceData()
                .Select(x => new SelectModel{
                Key = x.id,
                Value = x.companyname
            });
        }

        public IEnumerable<SelectModel> GetDataContractSelected()
        {
            return _context.Contracts.Where(x=>x.IsActive==true)
                .Select(x => new SelectModel
                {
                    Key = x.ID,
                    Value = x.ContractTitle
                });
        }

        public IEnumerable<SelectModel> GetObjectType()
        {
            return _context.ObjectTypes.Where(x => x.IsActive == true)
                .Select(x => new SelectModel
                {
                    Key = x.ID,
                    Value = x.Name,
                });
        }


        #endregion

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
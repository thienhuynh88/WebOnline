var ContractService = {

    GetContractObjectJson: function (options) {
        options = options || 0;
        return shellService.ExecutePostAction('Contract/GetContractObjectJson',
        {
            type: options
        });
    },

    SaveContract: function (data) {
        return shellService.ExecutePostFormAction('Contract/SaveContract', data);
    },
    
    UpdateContract: function (data) {
        return shellService.ExecutePostFormAction('Contract/UpdateContract', data);
    },

    SaveBank: function (data) {
        return shellService.ExecutePostFormAction('Contract/SaveBank', data);
    },
    
    InsertBank: function (data) {
        return shellService.ExecutePostFormAction('Contract/InsertBank', data);
    },

    GetBankList: function (options) {
        options = options || {};

        return shellService.ExecutePostAction('Contract/GetBankList', {
            pager: options
        });
    },
    
    GetRoyaltyRateTypes: function (options) {
        options = options || {};

        return shellService.ExecutePostAction('Contract/GetRoyaltyRateTypes', {
            pager: options
        });
    },

    GetBankById: function (options) {
        options = options || {};
        return shellService.ExecutePostAction('Contract/GetBankById', {
            options: options
        });
    },

    GetContractObjectList: function (options) {
        options = options || {};
        return shellService.ExecutePostAction('Contract/GetContractObjectList', {
            options: options
        });
    },

    GetContractObjectList2: function (options) {
        options = options || {};
        return shellService.ExecutePostAction('Contract/GetContractObjectList2', {
            options: options || {}
        });
    },

    GetContractObjectById: function (options) {
        options = options || {};
        return shellService.ExecutePostAction('Contract/GetContractObjectById', {
            options: options
        });
    },

    UpdateOrInsertContractObject: function (data) {
        return shellService.ExecutePostFormAction('Contract/UpdateInsertContractObject', data);
    },

    GetContractList: function (data) {
        return shellService.ExecutePostAction('contract/getlistcontracts', { model: data || {} });
    },

    UpdateContractStatus: function (data) {
        return shellService.ExecutePostAction('contract/updateContractStatus', data);
    },

    GetDataEntityJson: function () {
        return shellService.ExecutePostAction('Contract/GetDataEntityJson');
    },

    GetDataContractSelectedJson: function () {
        return shellService.ExecutePostAction('Contract/GetDataContractSelectedJson');
    },

    SearchInventoryJson: function (options) {
        options = options || {};
        return shellService.ExecutePostAction('Contract/SearchInventory', {
            data: options
        });
    },

    GetListBankByContractId: function (options) {
        return shellService.ExecutePostFormAction('Contract/GetListBankByContractId', options);
    },
    
    GetAvailableByContractId: function (options) {
        return shellService.ExecutePostFormAction('Contract/GetAvailableByContractId', options);
    },

    GetDataCatalogueIdJson: function (options) {
        return shellService.ExecutePostFormAction('Contract/GetDataCatalogueIdJson');
    },
    
    GetListGroupByContractId: function (options) {
        return shellService.ExecutePostFormAction('Group/GetListGroupByContractId', options);
    },
    
    GetLicenseeListByContractId: function (options) {
        return shellService.ExecutePostFormAction('Contract/GetLicenseeListByContractId', options);
    },
    
    UpdateLicenseeById: function (options) {
        options = options || {};
        return shellService.ExecutePostAction('ContractParty/UpdateLicenseeById', {
            data: options
        });

    },
    
    DeleteAttachFile: function (options) {
        return shellService.ExecutePostFormAction('Contract/DeleteAttachFile', options);
    },
   
    GetDataProductListByContractIdJson: function (options) {
        options = options || 0;
        return shellService.ExecutePostFormAction('Contract/GetDataProductListByContractIdJson',
        {
            contractId: options,
        });
    },

    DeleteContractMapProductByIdJson: function (options) {
        options = options || 0;
        return shellService.ExecutePostFormAction('Contract/DeleteContractMapProductById',
        {
            id: options,
        });
    },
    
    DeleteGroupProduct: function (data) {
        return shellService.ExecutePostFormAction('Contract/DeleteGroupProduct', data);
    },
    
    CheckSubmissionRefContractMapAvailableRight: function (data) {
        return shellService.ExecutePostFormAction('Contract/CheckSubmissionRefContractMapAvailableRight', data);
    },
    
    CheckSubmissionRefContractMapProduct: function (data) {
        return shellService.ExecutePostFormAction('Contract/CheckSubmissionRefContractMapProduct', data);
    },
    
    CheckProductRefSubmissionByContractId: function (data) {
        return shellService.ExecutePostFormAction('Contract/CheckProductRefSubmissionByContractId', data);
    },
    
    GetContractProductListDataJson: function (options) {
        options = options || {};        
        return shellService.ExecutePostAction('Contract/GetContractProductListDataJson', options);
    },
    
   SearchLicensingContractMore: function (data) {
        data = data || {};
        return shellService.ExecutePostAction('Home/SearchLicensingContractMore', data);
    },

};
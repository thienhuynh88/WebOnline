var UsersService = {

    SaveDataUserNameJson: function (data) {
        return shellService.ExecutePostFormAction('Users/SaveDataUserName', data);
    },
    
    GetListDataUsersJson:function(option) {
        option = option || {};
        return shellService.ExecutePostAction('Users/GetListDataUsersJson', {
            txtsearch: option.txtsearch,
            status: option.status,
            deptID: option.deptID
        });
    }
    

};
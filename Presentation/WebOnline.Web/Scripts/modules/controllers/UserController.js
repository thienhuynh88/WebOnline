var UserController = (function () {

    function innitViewUser() {
        $("#sex").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: [
                            { Key: "Name", Value: "Nam" },
                            { Key: "Nữ", Value: "Nữ" }
            ]
        });


        $("#ngay").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: PublicFunctionAll.GetDateInnit(),
        });

        $("#thang").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: PublicFunctionAll.GetMonthInnit(),
        });


        $("#nam").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: PublicFunctionAll.GetYearInnit(),
        });
        
        $("#status").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: [
                            { Key: "1", Value: "Hoạt động" },
                            { Key: "2", Value: "Tạm dừng" },
                            { Key: "0", Value: "Huỷ tài khoản" }
                        ]
        });
        
        
    }



    return {
        InnitViewUser: function () {
            innitViewUser();
        },

    };
})();
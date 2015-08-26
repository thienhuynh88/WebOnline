var UserController = (function () {

    function innitViewUser() {
        $("#sex").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: [
                            { Key: "1", Value: "Nam" },
                            { Key: "0", Value: "Nữ" }
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
        
        $("#Status").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: [
                            { Key: "1", Value: "Hoạt động" },
                            { Key: "2", Value: "Tạm dừng" },
                            { Key: "0", Value: "Huỷ tài khoản" }
                        ]
        });
        
        $("#DeptID").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: [
                            { Key: "3", Value: "Khách Hàng" },
                            { Key: "2", Value: "Khách Hàng VIP" },
                            { Key: "1", Value: "Admin" }
            ]
        });
       
        
        
    }

    function checkDataSubmitSave() {

        var ngay = $("#ngay").val();
        var thang = $("#thang").val();
        var nam = $("#nam").val();
        var birthday = ngay + '/' + thang + '/' + nam;
        $("#Birthdate").val(birthday);
        
        var fname = $("#fname").val();
        var lname = $("#lname").val();
        var username = $("#username").val();
        var password = $("#password").val();
        if (fname == undefined || fname == "") {
            common.AlertOK({
                message: 'Vui lòng nhập họ',
                title: 'Thông Báo',
                okCallback: function () {
                    $("#fname").focus();
                },
            });
            return false;
        } else if (lname == undefined || lname == "") {
            common.AlertOK({
                message: 'Vui lòng nhập tên',
                title: 'Thông Báo',
                okCallback: function () {
                    $("#lname").focus();
                },
            });
            return false;
        }
        else if (username == undefined || username == "") {
            common.AlertOK({
                message: 'Vui lòng nhập tên đăng nhập',
                title: 'Thông Báo',
                okCallback: function () {
                    $("#username").focus();
                },
            });
            return false;
        }
        else if (password == undefined || password == "") {
            common.AlertOK({
                message: 'Vui lòng nhập mật khẩu',
                title: 'Thông Báo',
                okCallback: function () {
                    $("#password").focus();
                },
            });
            return false;
        }

        return true;
    }
    
    function innitWebList() {
        $("#searchStatus").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: [
                            { Key: "-1", Value: "Tất cả" },
                            { Key: "1", Value: "Hoạt động" },
                            { Key: "2", Value: "Tạm dừng" },
                            { Key: "0", Value: "Huỷ tài khoản" }
            ]
        });

        $("#searchDeptID").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: [
                            { Key: "0", Value: "Tất cả" },
                            { Key: "3", Value: "Khách Hàng" },
                            { Key: "2", Value: "Khách Hàng VIP" },
                            { Key: "1", Value: "Admin" }
            ]
        });
    };
    

    var girdListUsers = undefined;

    function getDataListView() {
        var txtsearch = $("#txtsearch").val();
        var status = $("#searchStatus").val();
        var deptID = $("#searchDeptID").val();

        var dataSource;
        dataSource = new kendo.data.DataSource({
            type: "odata",
            transport: {
                read: function (options) {
                    UsersService.GetListDataUsersJson({
                        txtsearch: txtsearch,
                        status: status,
                        deptID: deptID
                    }).then(function (result) {
                        options.success(result);
                    }).fail(function (result) {
                        options.error(result);
                    });
                },
            },
            schema: {
                data: 'Data',
                total: 'TotalItems',
                model: {
                    fields: {

                    }
                }
            },
            pageSize: 100,
            serverPaging: true,
           
        });


        girdListUsers = $("#girdviewlistusers").kendoGrid({
            autoBind: false,
            dataSource: dataSource,
            resizable: true,
            sortable: true,
            scrollable: true,
            pageable: {
                refresh: true,
                pageSizes: [100, 200, 300, 400, 500],
                change: function (e) {
                    $("#pager").val("");
                    $("#pager").val(e.index);
                }
            },
            columns: [
                { field: "ID", title: "ID", hidden: true, attributes: { style: "text-align: center" } },
                { field: "FullName", title: "Họ Tên", attributes: { style: "text-align: left" }, width: '10%', template: '<label style="cursor: pointer" onclick="UserController.ShowDetail(#=ID#)">#=FullName#</label>' },
                { field: "SexString", title: "Giới Tính", attributes: { style: "text-align: center" }, width: '8%' },
                { field: "Email", title: "Email", attributes: { style: "text-align: left" }, width: '12%' },
                { field: "Mobile", title: "Mobile", attributes: { style: "text-align: left" }, width: '8%' },
                { field: "BirthDateString", title: "Ngày Sinh", attributes: { style: "text-align: center" }, width: '7%' },
                { field: "Address", title: "Địa Chỉ", attributes: { style: "text-align: left" } },
                { field: "CreateDayString", title: "Ngày Tạo ", attributes: { style: "text-align: center" }, width: '7%' },
                { field: "StatusString", title: "Tình Trạng", attributes: { style: "text-align: left" }, width: '10%' },
                { field: "DeptString", title: "Loại TK", attributes: { style: "text-align: left" }, width: '10%' } 
            ],
           
        }).data("kendoGrid");

        UserController.girdListUsers = girdListUsers;
        dataSource.read();
    };

    return {
        InnitViewUser: function () {
            innitViewUser();
        },

        SaveDataUserName:function() {
            if (checkDataSubmitSave() == true) {
                common.Confirm({
                    message: 'Bạn có muốn lưu dữ liệu ?',
                    title: 'Thông Báo',
                    okCallback: function () {
                        common.BlockUI();
                        var form = $("#frmSubmitUser");
                        var datastring = form.serialize();
                        console.log(datastring);
                        UsersService.SaveDataUserNameJson(datastring).
                            then(function (result) {
                                if (result > 0) {
                                    common.AlertOK({
                                        message: 'Lưu dữ liệu thành công',
                                        title: 'Thông Báo',
                                        okCallback: function () {
                                            window.location.href = "/Users/DetailUser?id=" + result;
                                        },
                                    });

                                } else {
                                    common.Alert("Lưu dữ liệu thất bại", "Thông Báo");
                                }
                            });
                        common.UnblockUI();
                    },
                    cancelCallback: function () {
                    }
                });
            };
        },
        


        InnitWebList:function() {
            innitWebList();
            getDataListView();
        },
        
        btnSearch:function() {
            getDataListView();
        },

        ShowDetail:function(id) {
            window.open("/Users/DetailUser?id=" + id);
        }
    };
})();
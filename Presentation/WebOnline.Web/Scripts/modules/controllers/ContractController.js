var controllerContract = (function () {

    //#region Private Variables and Methods

    var arrItemTag = [],
        intTag = 0,
        objItemTag = {
            Id: undefined,
            Name: undefined
        },
        objBank = {
            BankId: undefined,
            BankName: undefined,
            Address: undefined,
            Suburb: undefined,
            PostCode: undefined,
            State: undefined,
            Country: undefined,
            Phone: undefined,
            Fax: undefined,
            Email: undefined
        }, objContractObject = {
            ID: undefined,
            Name: undefined,
            Description: undefined,
            IsActive: undefined,
            ObjectTypeId: undefined
        }, objDesContractObject = {
            WdTitle: undefined
        }, gridCotractObj = undefined,
            objLicenseeDetail = {
                ID: undefined,
                Address: undefined,
                Suburb: undefined,
                PostCode: undefined,
                State: undefined,
                Country: undefined,
                FirstName: undefined,
                LastName: undefined,
                ACN: undefined,
                ABN: undefined,
                Phone: undefined,
                PriEmail: undefined
            },
        gridBankObj = undefined,
        gridAttachFile = undefined,
        arrAttachFile = [];
    //#endregion

    return {
        // public interface
        RegisterCommon: function() {
            controllerContract.dropDownEditorCurrency();
            controllerContract.signedDatePicker();
            controllerContract.addTag();
            controllerContract.loadBankGuarantee();
            controllerContract.starDateAndEndDateDatePicker();
            controllerContract.loadCountries1();
            controllerContract.loadCountries2();

            //controllerContract.loadDataForEditContract();
        },

        dropDownEditorCurrency: function() {
            contractPartyService.getCurrencies().then(function(result) {
                //console.log(result);
                $("#ddlCurrency").kendoDropDownList({
                    dataSource: result.Data,
                    dataTextField: "Code",
                    dataValueField: "Code",
                    change: function(e) {

                    },
                });
            });
        },

        loadDataForEditContract: function() {
            var mode = $('#modeContract').val();
            if (mode === 'edit') {
                controllerContract.loadBanksByContractId();
                controllerContract.loadIntellectualByContractId();
            }
        },

        loadBanksByContractId: function() {
            var id = $('#txtContractId').val();
            ContractService.GetListBankByContractId({ Keyword: id }).then(function(result) {
                $("#SelectBanks").data("kendoMultiSelect").value(result);
            });
        },

        loadIntellectualByContractId: function() {
            var id = $('#txtContractId').val();
            ContractService.GetAvailableByContractId({ Keyword: id, Page: ValueTypes.ContractObject.IntellecturalProperty }).then(function(result) {
                $("#SelectIntellectualProperty").data("kendoMultiSelect").value(result);
                $('#txtContractIntellectual').val(result);
            });
        },

        loadTerritoryByContractId: function() {
            var id = $('#txtContractId').val();
            ContractService.GetAvailableByContractId({ Keyword: id, Page: ValueTypes.ContractObject.Territory }).then(function(result) {
                $("#SelectTerritory").data("kendoMultiSelect").value(result);
                $('#txtContractTerritory').val(result);
            });
        },

        loadLanguageByContractId: function() {
            var id = $('#txtContractId').val();
            ContractService.GetAvailableByContractId({ Keyword: id, Page: ValueTypes.ContractObject.Language }).then(function(result) {
                $("#SelectLanguage").data("kendoMultiSelect").value(result);
                $('#txtContractLanguage').val(result);
            });
        },

        loadMarketByContractId: function() {
            var id = $('#txtContractId').val();
            ContractService.GetAvailableByContractId({ Keyword: id, Page: ValueTypes.ContractObject.Market }).then(function(result) {
                $("#SelectMarket").data("kendoMultiSelect").value(result);
                $('#txtContractMarket').val(result);
            });
        },

        loadSaleChannelByContractId: function() {
            var id = $('#txtContractId').val();
            ContractService.GetAvailableByContractId({ Keyword: id, Page: ValueTypes.ContractObject.SaleChannel }).then(function(result) {
                $("#SelectChannel").data("kendoMultiSelect").value(result);
                $('#txtContractSaleChanel').val(result);
            });
        },

        signedDatePicker: function() {
            var mode = $('#modeContract').val();
            if (mode === 'new') {
                $('#txtSignedDate').kendoDatePicker({
                    //value: new Date(2014, 10, 10),
                    value: new Date(),
                    format: 'dd/MM/yyyy',
                    animation: false
                });
            } else {
                $('#txtSignedDate').kendoDatePicker({
                    //value: new Date(2014, 10, 10),
                    //value: new Date(),
                    format: 'dd/MM/yyyy',
                    animation: false
                });
            }
        },

        starDateAndEndDateDatePicker: function() {
            var mode = $('#modeContract').val();
            if (mode === 'new') {
                $('#txtStartDay').kendoDatePicker({ value: new Date(), format: 'dd/MM/yyyy' });
                $('#txtEndDay').kendoDatePicker({ value: new Date(), format: 'dd/MM/yyyy' });
            } else {
                $('#txtStartDay').kendoDatePicker({ format: 'dd/MM/yyyy' });
                $('#txtEndDay').kendoDatePicker({ format: 'dd/MM/yyyy' });
            }
        },

        paymentTermFromDatePicker: function() {
            var hd = parseInt($("#hdNoPaymentTerm").val());
            var mode = $('#modeContract').val();
            if (hd === 1 && mode === "new") {
                $('#txtPaymentTermFromDate_' + 0).kendoDatePicker({
                    value: new Date(),
                    format: 'dd/MM/yyyy',
                    animation: false
                });
            }
        },

        paymentTermToDatePicker: function() {
            var hd = parseInt($("#hdNoPaymentTerm").val());
            var mode = $('#modeContract').val();
            if (hd === 1 && mode === "new") {
                $('#txtPaymentTermToDate_' + 0).kendoDatePicker({
                    value: new Date(),
                    format: 'dd/MM/yyyy',
                    animation: false
                });
            }
        },

        AddnewTag: function(objectBank) {
            intTag++;
            objItemTag.Id = objectBank.ID;
            objItemTag.Name = objectBank.Name;
            arrItemTag.push(objItemTag);
            var htmlTag = "<div id='div_" + objectBank.ID + "'><span data-id='panelTag_" + objectBank.ID + "' class='spanTag'>" +
                "<span data-id='item_tag_" + objectBank.ID + "'>" + objectBank.Name + "</span>" +
                "<button title='Click to remove' class='tag-button' onclick='controllerContract.rmvTag(" + objectBank.ID + ");'>x</button>" +
                "</span></div>";


            $("#childTag").append(htmlTag);
            $('#item-tag').val('');
        },

        rmvPaymentTerm: function(divId, no) {
            $('#' + divId).hide();
            $('#PaymentTermFlag_' + no).val(ValueTypes.ObjectFlag.Remove);
        },

        rmvRoyaltyRate: function(divId, no) {
            $('#' + divId).hide();
            $('#RoyaltyRateFlag_' + no).val(ValueTypes.ObjectFlag.Remove);
        },

        rmvScheduleReport: function(divId, no) {
            $('#' + divId).hide();
            $('#RoyaltyRateFlag_' + no).val(ValueTypes.ObjectFlag.Remove);
        },

        dropDownListRoyaltyRateType: function() {
            var hd = parseInt($("#hdNoPaymentTerm").val());
            var mode = $('#modeContract').val();
            if (hd === 1 && mode === "new") {
                ContractService.GetRoyaltyRateTypes().then(function(result) {
                    $('#txtRoyaltyRateType_' + 0).kendoDropDownList({
                        dataSource: result,
                        dataTextField: "Value",
                        dataValueField: "Key"
                    });
                });
            }
        },

        dropDownListRoyaltyRateType1: function(no) {
            ContractService.GetRoyaltyRateTypes().then(function(result) {
                $('#txtRoyaltyRateType_' + no).kendoDropDownList({
                    dataSource: result,
                    dataTextField: "Value",
                    dataValueField: "Key"
                });
            });
        },

        addTag: function() {
            $("#item-tag").keypress(function(e) {
                if (e.keyCode == '13') {
                    var textTag = $('#item-tag').val();
                    intTag++;
                    objItemTag.Id = intTag;
                    objItemTag.Name = textTag;
                    arrItemTag.push(objItemTag);
                    var htmlTag = "<div id='div_" + intTag + "'><span data-id='panelTag_" + intTag + "' class='spanTag'>" +
                        "<span data-id='item_tag_" + intTag + "'>" + textTag + "</span>" +
                        "<button title='Click to remove' class='tag-button' onclick='controllerContract.rmvTag(" + intTag + ");'>x</button>" +
                        "</span></div>";


                    $("#childTag").append(htmlTag);
                    $('#item-tag').val('');
                }
            });
        },

        rmvTag: function(intItemTag) {
            $("#div_" + intItemTag).remove();
            var lenArrItemTag = arrItemTag.length;
            for (var i = 0; i < lenArrItemTag; i++) {
                if (intItemTag === arrItemTag[i].Id) {
                    arrItemTag.splice(i, 1);
                    i--;
                    lenArrItemTag--;
                }
            }
            //$("#" + intItemTag).remove();
        },

        saveContract: function() {
            var form = $("#frmContract");
            var datastring = form.serialize();
            ContractService.SaveContract(datastring).then(function(result) {
                if (result > 0) {
                    common.Confirm({
                        message: 'New Contract Created is No.' + result,
                        //+ ' !!! Click Ok go to Home',
                        title: 'Information',
                        okCallback: function() {
                            window.location = '/Contract/review/' + result;
                        },
                        cancelCallback: function() {

                        }
                    });
                } else {
                    common.Alert('Please check information contract!!', 'Information');
                }

            }).fail(function() {
                common.Alert('Please check information contract!!', 'Information');
            });
        },

        updateContract: function() {
            var form = $("#frmContract");
            var datastring = form.serialize();
            //var grid = $('#gridContractAttach').data('kendowGrid');
            ContractService.UpdateContract(datastring).then(function(result) {
                //console.log(result);
                if (result.contractid > 0) {
                    common.Confirm({
                        message: 'Contract Updated is No.' + result.contractid + '<br/>Click Ok go to review!',
                        //+ ' !!! Click Ok go to Home',
                        title: 'Information',
                        okCallback: function() {
                            window.location = '/Contract/review/' + result.contractid;
                            //grid.dataSource.read();
                        },
                        cancelCallback: function() {
                            arrAttachFile.forEach(function(entry) {
                                $('#aHref_' + entry.fileId).attr('href', '/Resources/FileAttachment/' + result.contractid + '/' + entry.fileName);
                            });
                        }
                    });
                } else {
                    common.Alert('Please check information contract!', 'Information');
                }

            }).fail(function() {
                common.Alert('Please check information contract!', 'Information');
            });
        },

        //loadDataDefaultContractDetail: function () {
        //    controllerContract.paymentTermFromDatePicker();
        //    controllerContract.paymentTermToDatePicker();
        //},

        updateLicenseeById: function() {
            objLicenseeDetail.ID = $('#LicensorId').val();
            objLicenseeDetail.Address = $('#txtAddress1').val();
            objLicenseeDetail.Suburb = $('#txtSuburb1').val();
            objLicenseeDetail.PostCode = $('#txtPostCode1').val();
            objLicenseeDetail.State = $('#txtState1').val();
            objLicenseeDetail.Country = $('#txtCountry1').val();
            objLicenseeDetail.ACN = $('#txtACN1').val();
            objLicenseeDetail.ABN = $('#txtABN1').val();
            objLicenseeDetail.FirstName = $('#txtLicensorFname').val();
            objLicenseeDetail.LastName = $('#txtLicensorLname').val();
            objLicenseeDetail.PriEmail = $('#txtEmail1').val();
            objLicenseeDetail.Phone = $('#txtPhone1').val();
            //console.log(objLicenseeDetail);
            ContractService.UpdateLicenseeById(objLicenseeDetail)
                .then(function(result) {
                    common.Confirm({
                        message: 'Update Successfull!',
                        title: 'Information',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                }).fail(function(result) {
                    common.Confirm({
                        message: 'Updated is unsucessful!. Please Contact IT Support',
                        title: 'Notification Message',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                });
        },

        updateLicenseeById1: function() {
            objLicenseeDetail.ID = $('#LicenseeId').val();
            objLicenseeDetail.Address = $('#txtAddress2').val();
            objLicenseeDetail.Suburb = $('#txtSuburb2').val();
            objLicenseeDetail.PostCode = $('#txtPostCode2').val();
            objLicenseeDetail.State = $('#txtState2').val();
            objLicenseeDetail.Country = $('#txtCountry2').val();
            objLicenseeDetail.ACN = $('#txtACN2').val();
            objLicenseeDetail.ABN = $('#txtABN2').val();
            objLicenseeDetail.FirstName = $('#txtLicenseeFname').val();
            objLicenseeDetail.LastName = $('#txtLicenseeLname').val();
            objLicenseeDetail.PriEmail = $('#txtEmail2').val();
            objLicenseeDetail.Phone = $('#txtPhone2').val();
            ContractService.UpdateLicenseeById(objLicenseeDetail)
                .then(function(result) {
                    common.Confirm({
                        message: 'Update Successfull!',
                        title: 'Information',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                }).fail(function(result) {
                    common.Confirm({
                        message: 'Updated is unsucessful!. Please Contact IT Support',
                        title: 'Notification Message',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                });;
        },

        reportScheduleDatePicker: function() {
            var hd = parseInt($("#hdNoReportSchedule").val());
            var mode = $('#modeContract').val();
            if (hd === 1 && mode === "new") {
                $('#txtReportDate_' + 0).kendoDatePicker({
                    value: new Date(),
                    format: 'dd/MM/yyyy',
                    animation: false
                });
            }
        },

        isNumberKey: function(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        },

        isDecimalKey: function(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode > 31 && (charCode < 46 || charCode > 59))
                return false;
            return true;
        },

        openWdBank: function() {
            $("#wdBankDetail").kendoWindow({
                title: "Bank Detail",
                width: "1412px",
                height: "677px",
                open: function(e) {
                    this.wrapper.css({ top: 90 });
                },
                close: function(e) {
                    controllerContract.refreshDropdownlistBank();
                },
                modal: true,
                content: {
                    url: mySettings.ApplicationPath + 'Contract/AddBank',
                    type: "POST",
                    data: { 'id': '1', 'page': '1', 'pageSize': '20' },
                    async: false,
                },
            });

            $("#wdBankDetail").data("kendoWindow").open().center();
        },

        saveBank: function() {
            var form = $("#frmBank");
            var datastring = form.serialize();
            ContractService.SaveBank(datastring).then(function(result) {
                var id = $('#ddlBankId').val() || 0;
                if (id > 0) {
                    common.Confirm({
                        message: 'Updated Successful !!!',
                        title: 'Information',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                } else {
                    controllerContract.dropDownEditorBank();
                    common.Confirm({
                        message: 'Inserted Successful !!!',
                        title: 'Information',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                }
            });
        },

        dropDownEditorBank: function() {
            ContractService.GetBankList()
                .then(function(result) {
                    $("#ddlBankId").kendoDropDownList({
                        dataTextField: "Value",
                        dataValueField: "Key",
                        dataSource: result,
                        optionLabel: '-- New Bank --',
                        change: function(e) {
                            var id = $('#ddlBankId').val() || 0;
                            controllerContract.GetBankById(id);
                        }
                    });
                });
        },

        GetBankById: function(id) {
            if (id > 0) {
                objBank.BankId = id;
                //objBank.BankName = $('#txtBankName').val();
                //objBank.Address = $('#txtBankAddress').val();
                //objBank.Suburb = $('#txtBankSuburd').val();
                //objBank.PostCode = $('#txtBankPostCode').val();
                //objBank.State = $('#txtBankState').val();
                //objBank.Country = $('#txtBankCountry').val();
                //objBank.Phone = $('#txtBankPhone').val();
                //objBank.Fax = $('#txtBankFax').val();
                //objBank.Email = $('#txtBankEmail').val();
                ContractService.GetBankById(objBank)
                    .then(function(result) {
                        var objtemp = result;
                        //console.log(objBank);
                        //$('#ddlBankId').val(objBank.BankId);
                        $('#txtBankName').val(objtemp[0].BankName);
                        $('#txtBankAddress').val(objtemp[0].Address);
                        $('#txtBankSuburd').val(objtemp[0].Suburb);
                        $('#txtBankPostCode').val(objtemp[0].PostCode);
                        $('#txtBankState').val(objtemp[0].State);
                        $('#txtBankCountry').val(objtemp[0].Country);
                        $('#txtBankPhone').val(objtemp[0].Phone);
                        $('#txtBankFax').val(objtemp[0].Fax);
                        $('#txtBankEmail').val(objtemp[0].Email);
                    });
            } else {
                $('#txtBankName').val("");
                $('#txtBankAddress').val("");
                $('#txtBankSuburd').val("");
                $('#txtBankPostCode').val("");
                $('#txtBankState').val("");
                $('#txtBankCountry').val("");
                $('#txtBankPhone').val("");
                $('#txtBankFax').val("");
                $('#txtBankEmail').val("");
            }

        },

        openWdContractObject: function(type) {
            var objTemp = controllerContract.GetTitleContractObject(type);
            var strTitle = objTemp.WdTitle;
            //console.log(objTemp);
            $("#wdContractObjectDetail").kendoWindow({
                title: strTitle,
                width: "812px",
                height: "497px",
                open: function(e) {
                    this.wrapper.css({ top: 90 });
                },
                close: function(e) {
                    controllerContract.refreshDropdownlistContractObject(type);
                },
                modal: true,
                content: {
                    url: mySettings.ApplicationPath + 'Contract/OpenContractObject',
                    type: "POST",
                    data: { 'Keyword': type },
                    async: false,
                },
            });
            $("#wdContractObjectDetail").data("kendoWindow").open().center();
            $("#wdContractObjectDetail_wnd_title").html(strTitle);

        },

        dropDownEditorContractObject: function(id) {
            var lblTitle = '';
            switch (id) {
            case ValueTypes.ContractObject.Language:
                lblTitle = '-- New Language --';
                break;
            case ValueTypes.ContractObject.Market:
                lblTitle = '-- New Market --';
                break;
            case ValueTypes.ContractObject.Territory:
                lblTitle = '-- New Territory --';
                break;
            case ValueTypes.ContractObject.SaleChannel:
                lblTitle = '-- New SaleChannel --';
                break;

            }
            ContractService.GetContractObjectList({ 'Keyword': id })
                .then(function(result) {
                    $("#ddlContractObjectlId").kendoDropDownList({
                        dataTextField: "Value",
                        dataValueField: "Key",
                        dataSource: result,
                        optionLabel: lblTitle,
                        change: function(e) {
                            var objId = $('#ddlContractObjectlId').val() || 0;
                            controllerContract.GetContractObjectById(objId);
                        }
                    });
                });
        },

        GetContractObjectById: function(id) {
            if (id > 0) {
                objContractObject.ID = id;
                ContractService.GetContractObjectById(objContractObject)
                    .then(function(result) {
                        var objtemp = result;
                        $('#txtContractObjectName').val(objtemp[0].Name);
                        $('#txtContractObjectDescription').val(objtemp[0].Description);
                        if (objtemp[0].IsActive) {
                            $('#chkContractObjectStatus').prop("checked", true);
                        } else {
                            $('#chkContractObjectStatus').prop("checked", false);
                        }
                    });
            } else {
                $('#txtContractObjectName').val('');
                $('#txtContractObjectDescription').val('');
                $('#chkContractObjectStatus').prop("checked", true);
            }

        },

        saveContractObject: function() {
            var form = $("#frmContractObject");
            var datastring = form.serialize();
            ContractService.UpdateOrInsertContractObject(datastring).then(function(result) {
                var id = $('#ddlContractObjectlId').val() || 0;
                if (id > 0) {
                    common.Confirm({
                        message: 'Updated Successful !!!',
                        title: 'Information',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                } else {
                    controllerContract.loadContractObject(ValueTypes.ContractObject.Territory);
                    controllerContract.loadContractObject(ValueTypes.ContractObject.Language);
                    controllerContract.loadContractObject(ValueTypes.ContractObject.Market);
                    controllerContract.loadContractObject(ValueTypes.ContractObject.SaleChannel);
                    common.Confirm({
                        message: 'Inserted Successful !!!',
                        title: 'Information',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                }
            });
            controllerContract.dropDownEditorContractObject();
        },

        GetTitleContractObject: function(id) {
            objDesContractObject.WdTitle = '';
            switch (id) {
            case ValueTypes.ContractObject.Territory:
                objDesContractObject.WdTitle = 'Territory Detail';
                break;
            case ValueTypes.ContractObject.IntellecturalProperty:
                objDesContractObject.WdTitle = 'Intellectual Detail';
                break;
            case ValueTypes.ContractObject.Language:
                objDesContractObject.WdTitle = 'Language Detail';
                break;
            case ValueTypes.ContractObject.Market:
                objDesContractObject.WdTitle = 'Market Detail';
                break;
            case ValueTypes.ContractObject.SaleChannel:
                objDesContractObject.WdTitle = 'SaleChannel Detail';
                break;
            default:
                objDesContractObject.WdTitle = 'Information Detail';
            }
            return objDesContractObject;
        },

        addMorePaymentTerm: function() {
            $.ajax({
                //url: mySettings.ApplicationPath + 'Contract/PaymentTerm?no=' + $("#hdNoPaymentTerm").val(),
                url: mySettings.ApplicationPath + 'Contract/PaymentTerm',
                data: 'model=' + null + "&no=" + $("#hdNoPaymentTerm").val(),
                success: function(result) {
                    $("#MainPaymentTerm").append(result);
                    //////$("#btnPaymentTermAddMore").siblings($("#pnPaymentTerm")).text("Anh Em tot");
                    //////$("div[name=pnPaymentTerm]").last().children(":text[name='FromDate']").css("background-color", "red");
                    ////$("div[name=pnPaymentTerm_" + $("#hdNoPaymentTerm").val() + "]").last().children(":text[name$='.FromDate']").kendoDatePicker({
                    ////    value: new Date(), format: 'dd/MM/yyyy',
                    ////    animation: false
                    ////});
                    ////$("div[name=pnPaymentTerm_" + $("#hdNoPaymentTerm").val() + "]").last().children(":text[name$='.ToDate']").kendoDatePicker({
                    ////    value: new Date(), format: 'dd/MM/yyyy',
                    ////    animation: false
                    ////});


                    //$('#txtPaymentTermFromDate_' + ).kendoDatePicker({
                    //    value: new Date(), format: 'dd/MM/yyyy',
                    //    animation: false
                    //});
                    var hd = $("#hdNoPaymentTerm").val();
                    if (hd > 0) {
                        $('#txtPaymentTermFromDate_' + $("#hdNoPaymentTerm").val()).kendoDatePicker({
                            value: new Date(),
                            format: 'dd/MM/yyyy',
                            animation: false
                        });
                        $('#txtPaymentTermToDate_' + $("#hdNoPaymentTerm").val()).kendoDatePicker({
                            value: new Date(),
                            format: 'dd/MM/yyyy',
                            animation: false
                        });
                    }


                    var mode = $('#modeContract').val();

                    if (hd === "0" && mode === 'edit') {
                        $('#txtPaymentTermFromDate_' + hd).kendoDatePicker({
                            value: new Date(),
                            format: 'dd/MM/yyyy',
                            animation: false
                        });
                        $('#txtPaymentTermToDate_' + hd).kendoDatePicker({
                            value: new Date(),
                            format: 'dd/MM/yyyy',
                            animation: false
                        });
                    }
                    $("#hdNoPaymentTerm").val(Number($("#hdNoPaymentTerm").val()) + 1);

                }
            });
        },

        addMoreRoyaltyRate: function() {
            $.ajax({
                url: mySettings.ApplicationPath + 'Contract/RoyaltyRate',
                data: 'model=' + null + "&no=" + $("#hdNoRoyaltyRate").val(),
                success: function(result) {
                    $("#MainRoyaltyRate").append(result);
                    var hd = $("#hdNoRoyaltyRate").val();
                    if (hd > 0) {
                        controllerContract.dropDownListRoyaltyRateType1(hd);
                        ////ContractService.GetRoyaltyRateTypes().then(function (result1) {
                        ////    $('#txtRoyaltyRateType_' + $("#hdNoRoyaltyRate").val()).kendoDropDownList({
                        ////        dataSource: result1,
                        ////        dataTextField: "Value",
                        ////        dataValueField: "Key"
                        ////    });
                        ////});
                    }

                    var mode = $('#modeContract').val();

                    if (hd === "0" && mode === 'edit') {
                        controllerContract.dropDownListRoyaltyRateType1(hd);
                    }
                    $("#hdNoRoyaltyRate").val(Number($("#hdNoRoyaltyRate").val()) + 1);
                }

            });
        },

        addMoreReportSchedule: function() {
            $.ajax({
                url: mySettings.ApplicationPath + 'Contract/ReportSchedule',
                data: 'model=' + null + "&no=" + $("#hdNoReportSchedule").val(),
                success: function(result) {
                    $("#MainReportSchedule").append(result);
                    var hd = $("#hdNoReportSchedule").val();
                    if (hd > 0) {
                        $('#txtReportDate_' + $("#hdNoReportSchedule").val()).kendoDatePicker({
                            value: new Date(),
                            format: 'dd/MM/yyyy',
                            animation: false
                        });
                    }

                    ////$("div[id=reportSchedule_" + $("#hdNoReportSchedule").val() + "]").last().children(":text[name$='.ReportDate']").kendoDatePicker({
                    ////    value: new Date(), format: 'dd/MM/yyyy',
                    ////    animation: false
                    ////});
                    var mode = $('#modeContract').val();

                    if (hd === "0" && mode === 'edit') {
                        $('#txtReportDate_' + $("#hdNoReportSchedule").val()).kendoDatePicker({
                            value: new Date(),
                            format: 'dd/MM/yyyy',
                            animation: false
                        });
                    }

                    $("#hdNoReportSchedule").val(Number($("#hdNoReportSchedule").val()) + 1);
                }

            });
        },

        loadBankGuarantee: function() {
            contractPartyService.GetListBanksJson().then(function(result) {
                $("#SelectBanks").kendoMultiSelect({
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource: result,
                    change: function(e) {
                        $('#txtBankGuarantee').val($("#SelectBanks").data("kendoMultiSelect").value());
                    }
                });
                var mode = $('#modeContract').val();
                if (mode === 'edit') {
                    controllerContract.loadBanksByContractId();
                }
            });
        },

        loadContractObject: function(type) {
            var idContractObj = '';
            var idHiddenValue = '';
            switch (type) {
            case ValueTypes.ContractObject.IntellecturalProperty:
                idContractObj = $('#SelectIntellectualProperty');
                idHiddenValue = $('#txtContractIntellectual');
                break;
            case ValueTypes.ContractObject.Territory:
                idContractObj = $('#SelectTerritory');
                idHiddenValue = $('#txtContractTerritory');
                break;
            case ValueTypes.ContractObject.Language:
                idContractObj = $('#SelectLanguage');
                idHiddenValue = $('#txtContractLanguage');
                break;
            case ValueTypes.ContractObject.Market:
                idContractObj = $('#SelectMarket');
                idHiddenValue = $('#txtContractMarket');
                break;
            case ValueTypes.ContractObject.SaleChannel:
                idContractObj = $('#SelectChannel');
                idHiddenValue = $('#txtContractSaleChanel');
                break;
            default:
                idContractObj = $('#SelectIntellectualProperty');
                idHiddenValue = $('#txtContractIntellectual');
                break;

            }
            ContractService.GetContractObjectList({ Keyword: type }).then(function(result) {
                idContractObj.kendoMultiSelect({
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource: result,
                    change: function(e) {
                        var oldValue = idHiddenValue.val();
                        idHiddenValue.val(idContractObj.data("kendoMultiSelect").value());
                        var newValue = idHiddenValue.val();
                        controllerContract.CheckSubmissionRefContractMapAvailableRight(oldValue, newValue, idContractObj, idHiddenValue);
                    }
                });
                var mode = $('#modeContract').val();
                if (mode === 'edit') {
                    if (type === ValueTypes.ContractObject.IntellecturalProperty) {
                        controllerContract.loadIntellectualByContractId();
                    } else if (type === ValueTypes.ContractObject.Territory) {
                        controllerContract.loadTerritoryByContractId();
                    } else if (type === ValueTypes.ContractObject.Language) {
                        controllerContract.loadLanguageByContractId();
                    } else if (type === ValueTypes.ContractObject.Market) {
                        controllerContract.loadMarketByContractId();
                    } else if (type === ValueTypes.ContractObject.SaleChannel) {
                        controllerContract.loadSaleChannelByContractId();
                    }
                }
            });
        },

        loadGridContractObject: function(type) {
            var dataSource; // instance of kendo
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        ContractService.GetContractObjectList2({
                            Keyword: type,
                            Page: gridCotractObj.dataSource.page(),
                            PageSize: gridCotractObj.dataSource.pageSize()
                        }).then(function(result) {
                            options.success(result);
                        }).fail(function(result) {
                            options.error(result);
                        });
                    },
                    create: function(options) {
                        ContractService.UpdateOrInsertContractObject({
                                ID: options.data.ID,
                                Name: options.data.Name,
                                Description: options.data.Description,
                                IsActive: options.data.IsActive,
                                ObjectTypeId: type
                            }
                        ).then(function(result) {
                            gridCotractObj.dataSource.read(gridCotractObj.dataSource.page());
                        }).fail(function(result) {
                            options.error(result);
                        });
                    },
                    update: function(options) {
                        ContractService.UpdateOrInsertContractObject({
                                ID: options.data.ID,
                                Name: options.data.Name,
                                Description: options.data.Description,
                                IsActive: options.data.IsActive,
                                ObjectTypeId: type
                            }
                        ).then(function(result) {
                            options.success(result);
                        }).fail(function(result) {
                            options.error(result);
                        });
                    },
                },
                schema: {
                    data: 'Data',
                    total: 'TotalItems',
                    model: {
                        id: "ID",
                        fields: {
                            IsActive: { type: "boolean" },
                        }
                    }
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true

            });

            gridCotractObj = $("#gridContractObj").kendoGrid({
                autoBind: false,
                dataSource: dataSource,
                height: 470,
                resizable: true,
                groupable: true,
                selectable: true,
                filterable: true,
                //sortable: true,
                toolbar: ["create"],
                editable: "inline",
                sortable: {
                    mode: "multiple",
                    allowUnsort: true
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [
                    //http://docs.telerik.com/kendo-ui/api/web/grid#configuration-columns.format
                    { field: "ID", hidden: 'ID' },
                    { field: "Name", title: 'Name', width: 120 },
                    { field: "Description", title: 'Description', width: 300 },
                    { field: "IsActive", title: 'Acitve', width: 100 },
                    {
                        //http://docs.telerik.com/kendo-ui/api/web/grid#configuration-columns.command
                        command:
                        [
                            "edit"
                            //{
                            //    text: 'Delete',
                            //}
                        ],
                        title: " ",
                        width: "140px"
                    }
                ]
            }).data("kendoGrid");

            dataSource.read();
        },

        loadGridBank: function() {
            var dataSource; // instance of kendo
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        ContractService.GetBankList({
                            Keyword: '',
                            Page: gridBankObj.dataSource.page(),
                            PageSize: gridBankObj.dataSource.pageSize()
                        }).then(function(result) {
                            options.success(result);
                        }).fail(function(result) {
                            options.error(result);
                        });
                    },
                    create: function(options) {
                        ContractService.InsertBank({
                                ID: options.data.ID,
                                BankName: options.data.BankName,
                                Address: options.data.Address,
                                Suburb: options.data.Suburb,
                                PostCode: options.data.PostCode,
                                State: options.data.State,
                                Country: options.data.Country,
                                Phone: options.data.Phone,
                                Fax: options.data.Fax,
                                Email: options.data.Email,
                                IsActive: options.data.IsActive,
                            }
                        ).then(function(result) {
                            options.success(result);
                        }).fail(function(result) {
                            options.error(result);
                        });
                    },
                    update: function(options) {
                        ContractService.SaveBank({
                                ID: options.data.ID,
                                BankName: options.data.BankName,
                                Address: options.data.Address,
                                Suburb: options.data.Suburb,
                                PostCode: options.data.PostCode,
                                State: options.data.State,
                                Country: options.data.Country,
                                Phone: options.data.Phone,
                                Fax: options.data.Fax,
                                Email: options.data.Email,
                                IsActive: options.data.IsActive,
                            }
                        ).then(function(result) {
                            options.success(result);
                        }).fail(function(result) {
                            options.error(result);
                        });
                    },
                },
                schema: {
                    data: 'Data',
                    total: 'TotalItems',
                    model: {
                        id: "ID",
                        fields: {
                            IsActive: { type: "boolean" },
                        }
                    }
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true

            });

            gridBankObj = $("#gridBank").kendoGrid({
                autoBind: false,
                dataSource: dataSource,
                height: 470,
                resizable: true,
                groupable: true,
                selectable: true,
                filterable: true,
                //sortable: true,
                toolbar: ["create"],
                editable: "inline",
                sortable: {
                    mode: "multiple",
                    allowUnsort: true
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [
                    //http://docs.telerik.com/kendo-ui/api/web/grid#configuration-columns.format
                    { field: "ID", hidden: 'ID' },
                    { field: "BankName", title: 'Name', width: 150 },
                    { field: "Address", title: 'Address', width: 220 },
                    { field: "Suburb", title: 'Suburb', width: 130 },
                    { field: "PostCode", title: 'PostCode', width: 80 },
                    { field: "State", title: 'State', width: 100 },
                    { field: "Country", title: 'Country', width: 100 },
                    { field: "Phone", title: 'Phone', width: 100 },
                    { field: "Fax", title: 'Fax', width: 100 },
                    { field: "Email", title: 'Email', width: 100 },
                    { field: "IsActive", title: 'Acitve', width: 100 },
                    {
                        //http://docs.telerik.com/kendo-ui/api/web/grid#configuration-columns.command
                        command:
                        [
                            "edit"
                            //{
                            //    text: 'Delete',
                            //}
                        ],
                        title: " ",
                        width: "140px"
                    }
                ]
            }).data("kendoGrid");

            dataSource.read();
        },

        getArrAttacheFile: function() {
            return arrAttachFile;
        },

        setArrAttacheFile: function() {
            var strFile = $('#txtAttachedFileName').val();
            //var arrFiles = strFile.spli
            return arrAttachFile;
        },

        loadGridAttacheFile: function() {
            //var mode = $('#modeContract').val();
            //if (mode === 'new') {
            $("#gridContractAttach").kendoGrid({
                //autoBind: false,
                //dataSource: dataSource,
                height: 270,
                //resizable: true,
                //groupable: true,
                selectable: true,
                filterable: true,
                columns: [
                    { field: "fileId", hidden: true, template: '<input type="hidden" value="#=fileId#" id="txtFileId_#=fileId#" name="ContractAttachFile[#=fileId#].fileId" />' },
                    { field: "tempType", hidden: true, template: '<input type="hidden" value="#=tempType#" id="txtFileId_#=fileId#" name="ContractAttachFile[#=fileId#].tempType" />' },
                    { field: "", width: 40, attributes: { style: "text-align:center;" }, template: '<a title="Click here to delete this item" class="k-icon k-i-close" onclick="controllerContract.rmvAttachFile(#=fileId#);" style="text-align: center;"> </a>' },
                    { field: "fileName", title: "File Name", width: 289, template: '<input type="hidden" value="#=fileName#" id="txtFileId_#=fileId#" name="ContractAttachFile[#=fileId#].fileName" />#if(tempType===0){#<a style="float: left; text-align: right;text-decoration: none;color: green;" id="aHref_#=fileId#" target="_blank" href="/Resources/FileAttachment/Temp/#=fileName#">#=fileName#</a>#}else{#<a style="float: left; text-align: right;text-decoration: none;color: green;" id="aHref_#=fileId#" target="_blank" href="/Resources/FileAttachment/#=contractId#/#=fileName#">#=fileName#</a>#}#' }
                ],
                dataSource: controllerContract.getArrAttacheFile()
            });
            //} else {
            //    $("#gridContractAttach").kendoGrid({
            //        //autoBind: false,
            //        //dataSource: dataSource,
            //        height: 270,
            //        //resizable: true,
            //        //groupable: true,
            //        selectable: true,
            //        filterable: true,
            //        columns: [
            //            { field: "fileId", hidden: true },
            //            { field: "", width: 40, attributes: { style: "text-align:center;" }, template: '<a title="Click here to delete this item" class="k-icon k-i-close" onclick="controllerContract.rmvAttachFile(#=fileId#);" style="text-align: center;"> </a>' },
            //            { field: "fileName", title: "File Name", width: 289, template: '<input type="hidden" value="#=fileName#" id="txtFileId_#=fileId#" name="Id" /><a style="float: left; text-align: right;text-decoration: none;color: green;" id="aHref_#=fileId#" target="_blank" href="http://sysweb1.vn.tpf:779/Resources/FileAttachment/#=contractId#/#=fileName#">#=fileName#</a>' }
            //        ],
            //        dataSource: controllerContract.getArrAttacheFile()
            //    });
            //}

        },

        refreshDropdownlistBank: function(type) {
            contractPartyService.GetListBanksJson().then(function(result) {
                $('#SelectBanks').data("kendoMultiSelect").setDataSource(result);
            });
        },

        refreshDropdownlistContractObject: function(type) {
            switch (type) {
            case ValueTypes.ContractObject.IntellecturalProperty:
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectIntellectualProperty').data("kendoMultiSelect").setDataSource(result);
                });
                break;
            case ValueTypes.ContractObject.Territory:
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectTerritory').data("kendoMultiSelect").setDataSource(result);
                });
                break;
            case ValueTypes.ContractObject.Language:
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectLanguage').data("kendoMultiSelect").setDataSource(result);
                });
                break;
            case ValueTypes.ContractObject.Market:
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectMarket').data("kendoMultiSelect").setDataSource(result);
                });
                break;
            case ValueTypes.ContractObject.SaleChannel:
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectChannel').data("kendoMultiSelect").setDataSource(result);
                });
                break;
            default:
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectIntellectualProperty').data("kendoMultiSelect").setDataSource(result);
                });
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectTerritory').data("kendoMultiSelect").setDataSource(result);
                });
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectLanguage').data("kendoMultiSelect").setDataSource(result);
                });
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectMarket').data("kendoMultiSelect").setDataSource(result);
                });
                ContractService.GetContractObjectJson(type).then(function(result) {
                    $('#SelectChannel').data("kendoMultiSelect").setDataSource(result);
                });
                break;
            }
        },

        uploadAttachFile: function() {
            $("#filesAttachedFile").kendoUpload({
                multiple: true,
                async: {
                    saveUrl: mySettings.ApplicationPath + "Contract/UpdateAttachedFile",
                    removeUrl: true,
                    autoUpload: false
                },
                select: onSelect,
                success: onSuccess,
            });

            function onSelect(e) {
                var name = getFileInfo(e);
                //console.log('onselect', name);
            };

            function getFileInfo(e) {
                return $.map(e.files, function(file) {
                    var info = file.name;
                    return info;
                }).join(",");
            };

            function getFileSize(e) {
                return $.map(e.files, function(file) {
                    var info = file.size;
                    return info;
                }).join(",");
            };


            function onSuccess(e) {
                var files = e.files;
                //var mode = $('#modeContract').val();
                //var contractId = $('#txtContractId').val();
                if (e.operation == "upload") {
                    var obj = {};
                    obj.fileName = e.response;
                    //if (mode === 'edit') {
                    //    obj.contractId = contractId;
                    //    obj.tempType = 1;
                    //} else {
                    obj.contractId = 0;
                    obj.tempType = 0;
                    //}
                    obj.fileId = arrAttachFile.length;
                    arrAttachFile.push(obj);
                    //console.log('upload', arrAttachFile);
                    controllerContract.loadGridAttacheFile();
                    var arrName = '';

                    arrAttachFile.forEach(function(entry) {
                        if (!arrName) {
                            arrName = entry.fileName;
                        } else {
                            arrName += "," + entry.fileName;
                        }
                    });
                    $('#txtAttachedFileName').val(arrName);
                }
            }
        },

        loadAttachFileForEdit: function() {
            var mode = $('#modeContract').val();
            var contractId = $('#txtContractId').val();
            if (mode === 'edit') {
                var arrFile = $('#txtContractFileName').val();
                var arrFiles = arrFile.split(',');
                var id = 0;
                arrFiles.forEach(function(entry) {
                    var objFile = {};
                    objFile.fileId = id++;
                    objFile.contractId = contractId;
                    objFile.tempType = 1;
                    objFile.fileName = entry;
                    arrAttachFile.push(objFile);
                });
                //console.log(arrAttachFile);
                controllerContract.loadGridAttacheFile();
            }
        },

        rmvAttachFile: function(fileId) {
            //console.log('rmk ', arrAttachFile);
            //alert('it me');
            var arrName = '';
            var fileNames = $("#txtFileId_" + fileId).val();
            arrAttachFile.forEach(function(entry, i) {
                if (entry.fileId == fileId) {
                    arrAttachFile.splice(i, 1);
                };
            });
            arrAttachFile.forEach(function(entry) {
                if (!arrName) {
                    arrName = entry.fileName;
                } else {
                    arrName += "," + entry.fileName;
                }
            });
            $('#txtAttachedFileName').val(arrName);
            controllerContract.loadGridAttacheFile();

            ContractService.DeleteAttachFile({ Keyword: fileNames, Page: $('#txtContractId').val() })
                .then(function(result) {
                    common.Confirm({
                        message: 'Update Successfull!',
                        title: 'Information',
                        okCallback: function() {
                            controllerContract.loadGridAttacheFile();
                        },
                        cancelCallback: function() {

                        }
                    });
                }).fail(function(result) {
                    common.Confirm({
                        message: 'Updated is unsucessful!. Please Contact IT Support',
                        title: 'Notification Message',
                        okCallback: function() {

                        },
                        cancelCallback: function() {

                        }
                    });
                });

        },

        rmvGroupAndListPro: function(strGroup) {
            var oldGroup = $('#txtGroup').val();
            var newGroup = $('#selGroup').data("kendoMultiSelect").value();
            var id = $('#txtContractId').val();
            var lstOldGroup = oldGroup.split(',').map(function(item) {
                return parseInt(item, 10);
            });
            Array.prototype.diff = function(a) {
                return this.filter(function(i) { return a.indexOf(i) < 0; });
            };
            var diff = lstOldGroup.diff(newGroup);

            if (diff) {
                var listProduct = ContractPartialController.GetListProduct();
                var lenListPro = listProduct.length;
                var arrPro = [];
                //console.log('diff', diff[0]);
                for (var j = 0; j < lenListPro; j++) {
                    if (listProduct[j].productgroup === diff[0]) {
                        arrPro.push(listProduct[j]);
                    }
                }
                if (arrPro.length > 0) {
                    ContractService.CheckProductRefSubmissionByContractId({ Keyword: '', Page: id, PageSize: diff[0] }).then(function(result) {
                        if (result) {
                            common.Confirm({
                                message: 'Have a submission was refer to this!',
                                title: 'Information',
                                okCallback: function() {
                                    $('#selGroup').data("kendoMultiSelect").value(lstOldGroup);
                                    $('#txtGroup').val($('#selGroup').data("kendoMultiSelect").value());
                                },
                                cancelCallback: function() {
                                    $('#selGroup').data("kendoMultiSelect").value(lstOldGroup);
                                    $('#txtGroup').val($('#selGroup').data("kendoMultiSelect").value());
                                }
                            });
                        } else {
                            diff.forEach(function(entry) {
                                $("label[id=lbpG_" + entry + "]").parent().parent().remove();
                                ContractPartialController.rmvProInList(entry);
                            });
                        }
                    });
                }
            }

            ////if (id === "0") {
            ////    diff.forEach(function(entry) {
            ////        $("label[id=lbpG_" + entry + "]").parent().parent().remove();
            ////        ContractPartialController.rmvProInList(entry);
            ////      });
            ////} else {
            ////   diff.forEach(function (entry) {
            ////       $("label[id=lbpG_" + entry + "]").parent().parent().hide();
            ////       $("label[id=lbpG_" + entry + "]").next().text('0');

            ////       //$("#btnPaymentTermAddMore").siblings($("#pnPaymentTerm")).text("Anh Em tot");

            ////   });

            ////   var diff2 = newGroup.diff(lstOldGroup);
            ////   diff2.forEach(function (entry) {
            ////       $("label[id=lbpG_" + entry + "]").parent().parent().show();
            ////       $("label[id=lbpG_" + entry + "]").next().text('2');
            ////   });
            ////}
        },

        CheckSubmissionRefContractMapAvailableRight: function(oldVal, newVal, idContr, idHidd) {
            var id = $('#txtContractId').val();
            var lstOldVal;
            var lstNewVal;
            if (oldVal != '') {
                lstOldVal = oldVal.split(',').map(function(item) {
                    return parseInt(item, 10);
                });
            }
            if (newVal != '') {
                lstNewVal = newVal.split(',').map(function(item) {
                    return parseInt(item, 10);
                });
            }
            Array.prototype.diff = function(a) {
                return this.filter(function(i) { return a.indexOf(i) < 0; });
            };
            var objId = lstOldVal.diff(newVal);
            ContractService.CheckSubmissionRefContractMapAvailableRight({ Keyword: '', Page: id }).then(function(result) {
                //console.log(result);
                if (result) {
                    var lenResult = result.length;
                    for (var i = 0; i < lenResult; i++) {
                        if (result[i] === objId[0]) {
                            common.Confirm({
                                message: 'Have a submission was refer to this!',
                                //+ ' !!! Click Ok go to Home',
                                title: 'Information',
                                okCallback: function() {
                                    //console.log(idContr);
                                    idContr.data("kendoMultiSelect").value(lstOldVal);
                                    idHidd.val(dContr.data("kendoMultiSelect").value());
                                },
                                cancelCallback: function() {
                                    idContr.data("kendoMultiSelect").value(lstOldVal);
                                    idHidd.val(dContr.data("kendoMultiSelect").value());
                                }
                            });
                            return;
                        }
                    }
                }
            });
        },

        loadCountries1: function() {
            contractPartyService.getCountries1()
                .then(function(result) {
                    //console.log(result);
                    $("#txtCountry1").kendoDropDownList({
                        dataTextField: "Value",
                        dataValueField: "Value",
                        dataSource: result,
                        optionLabel: "--COUNTRY--"
                    });
                });
        },

        loadCountries2: function() {
            contractPartyService.getCountries1()
                .then(function(result) {
                    //console.log(result);
                    $("#txtCountry2").kendoDropDownList({
                        dataTextField: "Value",
                        dataValueField: "Value",
                        dataSource: result,
                        optionLabel: "--COUNTRY--"
                    });
                });
        },

        OnNextPage: function(page) {
            kendo.ui.progress($('#customerSettings'), true);
            $('#wdListContract').scrollTop(0);
            ContractService.SearchLicensingContractMore({ 'Keyword': $("#txtKeywordSearch").val(), 'page': page, 'pageSize': '20' }).then(function(result) {
                $("#wdListContract").html(result);
                kendo.ui.progress($('#customerSettings'), false);
            });

        },

        onPressSearch: function() {
            $("#txtKeywordSearch").keyup(function(e) {
                if (e.keyCode === 13) {
                    // Do something
                    common.BlockUI();
                    var keyword = $('#txtKeywordSearch').val();
                    $("#wdListContract").kendoWindow({
                        title: "Search Information",
                        width: "1400px",
                        height: "900px",
                        open: function() {
                            this.wrapper.css({ top: 90 });
                        },
                        modal: true,
                        content: {
                            url: mySettings.ApplicationPath + 'Home/SearchLicensingContract',
                            type: "POST",
                            data: { 'Keyword': keyword, 'page': '1', 'pageSize': '20' },
                            async: false,
                        },
                    });
                    $("#wdListContract").data("kendoWindow").open().center();
                    common.UnblockUI();
                }
            });
        },

        bntSearch: function() {
            common.BlockUI();
            var keyword = $('#txtKeywordSearch').val();
            $("#wdListContract").kendoWindow({
                title: "Search Information",
                width: "1400px",
                height: "900px",
                open: function () {
                    this.wrapper.css({ top: 90 });
                },
                modal: true,
                content: {
                    url: mySettings.ApplicationPath + 'Home/SearchLicensingContract',
                    type: "POST",
                    data: { 'Keyword': keyword, 'page': '1', 'pageSize': '20' },
                    async: false,
                },
            });
            $("#wdListContract").data("kendoWindow").open().center();
            common.UnblockUI();
        },

};
})();
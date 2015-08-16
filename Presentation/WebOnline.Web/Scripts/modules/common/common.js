/*Init Default*/
$(function () {
    common.RegisterCommon();
});//ready

var common = {
    RegisterCommon: function () {
        // init jquery tooltip for all elements which have the title attribute
        //$('.jtooltip').tooltip({ track: true });

        $(document)
            .ajaxStart(common.BlockUI)
            .ajaxStop($.unblockUI)
            .ajaxError(function (event, request, settings) {
                common.Alert(Resources.Common.Error.ErrorWhenAction);
            });
    },

    /*functions*/
    OpenPage: function (path, width, height) {
        var x = (window.screen.width - width) / 2;
        var y = (window.screen.height - height) / 2;
        window.open(path, null, "directories=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=" + width + ",height=" + height + ",top=" + y + ",left=" + x, null);
    },

    SimplifyUnicodeCharacters: function (content, isAllowSpecialChars) {
        content = $.trim(content);
        content = content.toLowerCase();
        content = content.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        content = content.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        content = content.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        content = content.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        content = content.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        content = content.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        content = content.replace(/đ/g, "d");
        content = content.replace(/ð/g, "d");
        // cho phép ký tự / ? & = : .
        if (isAllowSpecialChars) {
            content = content.replace(/[^a-z0-9 .:\-_\/\?\=\&]+/g, "-");
        }
        else {
            content = content.replace(/[^a-z0-9 \-_]+/g, "-");
        }
        content = content.replace(/_{2,}/g, "_"); //thay thế từ ký tự _ từ 2 thành 1 ký tự _
        content = content.replace(/ /g, "-"); //thay space -> -
        content = content.replace(/-{2,}/g, "-"); //thay thế từ ký tự - từ 2 thành 1 ký tự -
        content = content.replace(/^\-+|\-+$/g, ""); //cắt bỏ ký tự - ở đầu và cuối chuỗi
        return content;
    },

    SimplifyUnicodeCharactersForSearch: function (content) {
        content = content.toLowerCase();
        content = content.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        content = content.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        content = content.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        content = content.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        content = content.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        content = content.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        content = content.replace(/đ/g, "d");
        content = content.replace(/ð/g, "d");
        content = content.replace(/[^a-z0-9 ,]+/g, "");
        content = content.replace(/ {2,}/g, " "); //thay thế từ ký tự space từ 2 thành 1 ký tự space
        content = $.trim(content);

        return content;
    },

    /*Waiting*/
    // block toàn màn hình, sẽ hiện ra waiting    
    BlockUI: function () {
        $.blockUI({ message: '<div class="blockUI-waiting" onclick="common.UnblockUI()"></div>' });
        $('.blockUI.blockMsg.blockPage').attr('style', '');
        $('.blockUI.blockMsg.blockPage').attr('style', 'z-index: 1011;position: fixed;top: 40%;left: 50%;border-top-left-radius: 0;border-top-right-radius: 0;');
    },
    UnblockUI: function () {
        $.unblockUI();
    },

    Block: function (id) {
        id = id.indexOf('#') >= 0 ? id : '#' + id;
        $(id).block(
        //{ message: '<h1 class="blockUI-waiting"></h1>' }
            { message: '' }
        );
        $('.blockUI.blockMsg.blockElement').attr('style', '');
        $('.blockUI.blockMsg.blockElement').attr('style', 'z-index: 1011;position: absolute;padding: 0px; margin: 0px; top: 40%;left: 43%;');
    },
    Unblock: function (id) {
        id = id.indexOf('#') >= 0 ? id : '#' + id;
        $(id).unblock();
    },

    // dialog confirm
    /*
      
    common.Confirm({
        title: 'test',
        message: 'test',
        okCallback: function(){
            // code is here
        },
        cancelCallback: function(){
            // code is here
        }
    });
     */
    Confirm: function (options) {
        //options: title, message, okCallback, cancelCallback
        var title = options.title || 'Confirmation';

        var template = '<div>' + options.message;
        template += '<div style="margin-top: 10px;clear: both;text-align: right;border-width: 1px 0 0;border-style: solid;position: relative;padding: .6em;" class="k-edit-buttons k-state-default">' +
            '<a style="margin: 0 .16em;" class="k-button k-button-icontext k-grid-ok" href="#"><span class="k-icon k-ok"></span>OK</a>' +
            '<a style="margin: 0 .16em;" class="k-button k-button-icontext k-grid-cancel" href="#"><span class="k-icon k-cancel"></span>Cancel</a>' +
            '</div>';
        template += '</div>';

        var element = $(template);

        element.kendoWindow({
            modal: true,
            minWidth: "400px",
            maxWidth: "700px",
            title: title,
            actions: [
                "Close"
            ],
            close: function () {
                element.data("kendoWindow").destroy(); // destroy the Grid
            },
        });

        element.find('.k-grid-ok').bind('click', function (e) {
            element.data("kendoWindow").destroy();
            if (options.okCallback) options.okCallback();

            e.preventDefault();
        });

        element.find('.k-grid-cancel').bind('click', function (e) {
            element.data("kendoWindow").destroy();
            if (options.cancelCallback) options.cancelCallback();

            e.preventDefault();
        });

        element.data("kendoWindow").center().open();
    },

    AlertOK: function (options) {
        //options: title, message, okCallback, cancelCallback
        var title = options.title || 'Confirmation';

        var template = '<div>' + options.message;
        template += '<div style="margin-top: 10px;clear: both;text-align: right;border-width: 1px 0 0;border-style: solid;position: relative;padding: .6em;" class="k-edit-buttons k-state-default">' +
            '<a style="margin: 0 .16em;" class="k-button k-button-icontext k-grid-ok" href="#"><span class="k-icon k-ok"></span>OK</a>' +
            '</div>';
        template += '</div>';

        var element = $(template);

        element.kendoWindow({
            modal: true,
            minWidth: "400px",
            maxWidth: "700px",
            title: title

        });

        element.find('.k-grid-ok').bind('click', function (e) {
            element.data("kendoWindow").destroy();
            if (options.okCallback) options.okCallback();

            e.preventDefault();
        });



        element.data("kendoWindow").center().open();
    },
    //nếu bạn muốn truyền content dạng html thì content = id của thẻ chứa html vào
    Alert: function (content, title) {
        title = title || 'Information';
        content = content || '';

        var template = '<div>' + content;
        template += '<div style="margin-top: 10px;clear: both;text-align: right;border-width: 1px 0 0;border-style: solid;position: relative;padding: .6em;" class="k-edit-buttons k-state-default">' +
            //'<a style="margin: 0 .16em;" class="k-button k-button-icontext k-primary k-grid-update" href="#"><span class="k-icon k-update"></span>Update</a>' +
            '<a style="margin: 0 .16em;" class="k-button k-button-icontext k-grid-ok" href="#"><span class="k-icon k-ok"></span>OK</a>' +
            '</div>';
        template += '</div>';


        var element = $(template);

        element.kendoWindow({
            modal: true,
            minWidth: "400px",
            maxWidth: "700px",
            title: title,
            actions: [
                "Close"
            ],
            close: function () {
                element.data("kendoWindow").destroy();
            },
        });

        element.find('.k-grid-ok').bind('click', function (e) {
            element.data("kendoWindow").destroy();
            e.preventDefault();
            return false;
        });

        element.data("kendoWindow").center().open();
    },

    // load js, css
    //http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
    LoadJs: function (filename) {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },

    LoadCss: function (filename) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);

        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },

    ConvertJSONDateToDate: function (jsonDate) {
        if (!jsonDate) return null;

        // jsonDate: '/Date(1291548407008)/';
        var dateSlice = jsonDate.slice(6, 24);//1291548407008
        var milliseconds = parseInt(dateSlice);
        return new Date(milliseconds);
    },
    imgError: function (image) {
        image.onerror = "";
        image.src = "/Images/Avatars/NoImageAvailable.png";

        return true;
    },

    isNumberKey: function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    },

    isDecimalKey: function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 46 || charCode > 59))
            return false;
        return true;
    },


};
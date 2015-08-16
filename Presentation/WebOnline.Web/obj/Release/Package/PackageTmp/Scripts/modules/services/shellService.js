var shellService = (function () {

    //#region Private: variables, methods
    function executeAction(url, options, isUsingForForm, dataTypeIsHtml) {
        options = options || {};

        var defer = $.Deferred();

        var dataType = 'json';

        if (dataTypeIsHtml) {
            dataType = 'html';
        }

        var settings = {
            url: mySettings.ApplicationPath + url,
            type: 'POST',
            traditional: true,
            dataType: dataType
        };

        if (isUsingForForm) {
            settings.data = options;
            settings.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
        } else {
            // phải dùng stringify, nếu dùng post hoặc get thì nó tự làm
            buildKendoOptions(options.options);
            settings.data = JSON.stringify(options);
            settings.contentType = 'application/json; charset=utf-8';
        }

        //http://api.jquery.com/jquery.ajax/
        // success, error, complete đã được khuyên không nên dùng kể từ jQuery 1.8.
        // hàm done, fail là của ajax jquery
        $.ajax(settings).done(function (result) {
            ////console.log(result);
            defer.resolve(result);
        }).fail(function (result) {
            ////console.log(result);
            defer.reject(result);
        });

        // Return the Promise so caller can't change the Deferred
        return defer.promise();
    }
    

    function executeGetAction(url, options) {
        options = options || {};

        var defer = $.Deferred();

        var settings = {
            url: mySettings.ApplicationPath + url,
            type: 'GET',
            traditional: true,
            data: options
        };
        
        //http://api.jquery.com/jquery.ajax/
        // success, error, complete đã được khuyên không nên dùng kể từ jQuery 1.8.
        // hàm done, fail là của ajax jquery
        $.ajax(settings).done(function (result) {
            ////console.log(result);
            defer.resolve(result);
        }).fail(function (result) {
            ////console.log(result);
            defer.reject(result);
        });

        // Return the Promise so caller can't change the Deferred
        return defer.promise();
    }
    


    function buildKendoOptions(options) {
        if (options && options.filter && options.filter.filters.length) {
            // an array[ {field, logic, items} ]
            var filters = [],
                singleItem = {
                    logic: options.filter.logic
                };

            _.each(options.filter.filters, function (item) {
                // array
                if (item.filters) {
                    filters.push({
                        logic: item.logic,
                        field: item.filters[0].field,
                        items: _.map(item.filters, function (itemChild) {
                            return {
                                field: itemChild.field,
                                Operator: itemChild.operator,
                                value: itemChild.value,
                            }
                        })
                    });
                } else if (item.field) {
                    // nếu chưa có thì tạo lần đầu
                    if (!singleItem.field) {
                        singleItem.field = item.field;
                        singleItem.items = [];
                    }

                    singleItem.items.push({
                        field: item.field,
                        //operator: item.operator,
                        Operator: item.operator,
                        value: item.value,
                    });
                }
            });

            filters.push(singleItem);

            options.filter = filters;
        }
    }

    var listGender;
    //#endregion

    return { // public interface

        //#region Execute Action

        /*==============
         * Execute Action: dùng cho các thao tác Post Json, options lúc này là object và nó sẽ được stringify trước khi truyền xuống server, nhằm mục đích mapping json trên client xuống model dưới server
         * options: object}
         */
        ExecutePostAction: function (url, options) {
            return executeAction(url, options);
        },

        ExecutePostActionWithDataTypeIsHtml: function (url, options) {
            return executeAction(url, options, false, true);
        },

        /*==============
         * Execute Action: dùng cho các thao tác Post Submit 1 form, data lúc này là string vì form.serialize() đã stringify rồi. nhằm mục đích mapping json trên client xuống model dưới server
         * data: string
         */
        ExecutePostFormAction: function (url, data) {
            return executeAction(url, data, true);
        },

        ExecutePostFormActionWithDataTypeIsHtml: function (url, data) {
            return executeAction(url, data, true, true);
        },
        ExecuteGetAction: function (url, options) {
            return executeGetAction(url, options);
        },


        //ExecutePostAction2: function (url, options) {
        //    var defer = $.Deferred();

        //    $.post(url, { data: JSON.stringify(options) })
        //        .done(function (data) {
        //            ////console.log(data);
        //            defer.resolve(data);
        //        })
        //        .fail(function (data) {
        //            ////console.log(data);
        //            defer.reject(data);
        //        });

        //    // Return the Promise so caller can't change the Deferred
        //    return defer.promise();
        //},

        //#endregion

        //#region Enum Resources

        ///summary
        /// Ví dụ objEnum = 
        ///         Gender: {
        ///             Male: 1,
        ///             Female: 2,
        ///             Other: 3
        ///         }
        ///     objResourceName: 'Gender'
        ///         Gender: {
        ///             Male: 'Male',
        ///             Female: 'Female',
        ///             Other: 'Other'
        ///         }
        ///   - value (number) = 2
        ///   --> kết quả = 'Female'
        ///summary
        GetEnumResourceString: function (objEnum, objResource, value) {
            var enumKey = shellService.ConvertEnumToString(objEnum, value);
            return objResource[enumKey];
        },

        ///summary
        /// Ví dụ objEnum = 
        ///         Gender: {
        ///             Male: 1,
        ///             Female: 2,
        ///             Other: 3
        ///         }
        ///   value = 1
        ///   --> kết quả = 'Male'
        ///summary
        ConvertEnumToString: function (objEnum, value) {
            for (var key in objEnum) {
                if (objEnum[key] === value) {
                    return key;
                }
            }
            return '';
        },

        //#endregion

        //#region Shared Functions
        GetListGender: function () {
            if (listGender) return listGender;

            var genders = ValueTypes.Gender;
            listGender = [];

            for (var key in genders) {
                listGender.push({
                    text: Resources.Enums.Gender[key],
                    value: genders[key]
                });
            }
            return listGender;
        },
        //#endregion

        //#region
        //#endregion
    };
})();
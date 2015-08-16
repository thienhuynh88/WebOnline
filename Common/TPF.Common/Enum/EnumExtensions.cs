using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace TPF.Common.Enum
{
    public static class EnumExtensions
    {
        #region Thẻ Meta Display
        /// <summary>
        /// Get thẻ Meta Display thuộc tính Name
        /// Mặc định nếu không có sẽ lấy Enum Name
        /// </summary>
        /// <param name="enumValue"></param>
        /// <returns></returns>
        public static string GetDisplayName(this System.Enum enumValue)
        {
            Type enumType = enumValue.GetType();
            return GetDisplayName(enumValue, enumType);
        }

        private static string GetDisplayName(this System.Enum enumValue, Type enumType)
        {
            var enumName = System.Enum.GetName(enumType, enumValue);

            FieldInfo field = enumType.GetField(enumName);
            if (field == null) return "";
            var attrs = field.GetCustomAttributes(typeof(DisplayAttribute), false);

            return attrs.Length > 0 ? ((DisplayAttribute)attrs[0]).Name : field.Name;
        }

        public static string GetDisplayName<T>(this object value)
        {
            var enumValue = (T)System.Enum.Parse(typeof(T), value.ToString(), true);
            Type enumType = enumValue.GetType();
            var enumName = System.Enum.GetName(enumType, enumValue);
            FieldInfo field = enumType.GetField(enumName);
            if (field == null) return "";
            var attrs = field.GetCustomAttributes(typeof(DisplayAttribute), false);

            return attrs.Length > 0 ? ((DisplayAttribute)attrs[0]).Name : field.Name;
        }

        public static string GetDescription(this System.Enum value)
        {
            Type enumType = value.GetType();
            var enumName = System.Enum.GetName(enumType, value);

            FieldInfo field = enumType.GetField(enumName);
            if (field == null) return "";
            var attrs = field.GetCustomAttributes(typeof(DisplayAttribute), false);
            return attrs.Length > 0 ? ((DisplayAttribute)attrs[0]).Description : field.Name;
        }

        /// <summary>
        /// Default: true
        ///  - False: không hiển thị
        ///  - True: hiển thị
        /// </summary>
        /// <returns></returns>
        public static bool GetAutoGenerateField(this System.Enum value)
        {
            Type enumType = value.GetType();
            var enumName = System.Enum.GetName(enumType, value);

            FieldInfo field = enumType.GetField(enumName);
            if (field == null) return true;
            var attrs = field.GetCustomAttributes(typeof(DisplayAttribute), false);

            if (attrs.Length > 0)
            {
                return ((DisplayAttribute)attrs[0]).GetAutoGenerateField() ?? true;
            }
            return true;
        }
        #endregion

        /// <summary>
        /// EnumCommonStatus
        /// {
        ///     Active = 1,
        ///     InActive = 2,
        ///     Deleted = 3
        /// }
        /// Ex: 
        ///     EnumCommonStatus.Active.ToInt() --> 1
        ///     EnumCommonStatus.Deleted.ToInt() --> 3
        /// </summary>
        /// <param name="enumValue"></param>
        /// <returns></returns>
        public static int ToInt(this System.Enum enumValue)
        {
            return Convert.ToInt32(enumValue);
        }

        /// <summary>
        /// EnumCommonStatus
        /// {
        ///     Active = 1,
        ///     InActive = 2,
        ///     Deleted = 3
        /// }
        /// Ex: 
        ///     EnumCommonStatus.Active.ValueToString() --> "1"
        ///     EnumCommonStatus.Deleted.ValueToString() --> "3"
        /// </summary>
        /// <param name="enumValue"></param>
        /// <returns></returns>
        public static string ValueToString(this System.Enum enumValue)
        {
            var value = Convert.ToInt32(enumValue);
            return value.ToString();
        }

        /// <summary>
        /// EnumCommonStatus
        /// {
        ///     Active = 1,
        ///     InActive = 2,
        ///     Deleted = 3
        /// }
        /// <![CDATA[
        /// Ex: status = 1
        ///     status.ToEnum<EnumCommonStatus>() -> sẽ convert về kiểu enum
        /// ]]>
        /// </summary>
        /// <param name="value">Giá trị của biến Enum</param>
        /// <returns></returns>
        public static T ToEnum<T>(this object value)
        {
            return (T)System.Enum.Parse(typeof(T), value.ToString(), true);
        }
    }
}

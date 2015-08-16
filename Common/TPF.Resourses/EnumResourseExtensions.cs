using System;

namespace TPF.Resourses
{
    public static class EnumResourseExtensions
    {
        /// <summary>
        /// Resource của EnumCommonStatus.Active lưu dưới dạng EnumCommonStatus_Active = "Kích Hoạt"
        /// -> cách lấy EnumCommonStatus.Active.ToEnumResourceString()
        /// </summary>
        /// <param name="value"></param>
        /// <param name="prefix"></param>
        /// <returns></returns>
        public static string ToEnumResourceString(this Enum value, string prefix = null)
        {
            prefix = prefix ?? "";
            return EnumResources.ResourceManager.GetString(prefix + value);
        }

        /// <summary>
        /// Resource của EnumCommonStatus.Active lưu dưới dạng EnumCommonStatus_Active = "Kích Hoạt"
        /// EnumCommonStatus
        /// {
        ///     Active = 1,
        ///     InActive = 2,
        ///     Deleted = 3
        /// }
        /// <![CDATA[
        /// Ex: status = 1
        ///     status.ToEnumResourceString<EnumCommonStatus>() -> sẽ convert về kiểu enum
        /// ]]>
        /// </summary>
        public static string ToEnumResourceString<T>(this object value, string prefix = null)
        {
            var enumValue = (T)Enum.Parse(typeof(T), value.ToString(), true);

            prefix = prefix ?? "";

            return EnumResources.ResourceManager.GetString(prefix + enumValue);
        }
    }
}
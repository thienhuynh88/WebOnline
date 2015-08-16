using System;
using System.Text.RegularExpressions;

namespace TPF.Common.Utils
{
    public class CheckerUtil
    {
        public static bool IsEmailAddress(string emailAddress)
        {
            return Regex.IsMatch(emailAddress, "^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\\-+)|([A-Za-z0-9]+\\.+))*[A-Za-z0-9]+@((\\w+\\-+)|(\\w+\\.))*\\w{1,63}\\.[a-zA-Z]{2,6}$");
        }
    }
}
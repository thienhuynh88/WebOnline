using System.Configuration;

namespace TPF.Configurations
{
    public class DefaultElement : ConfigurationElement
    {
        [ConfigurationProperty("PageSize", DefaultValue = 20)]
        public int PageSize
        {
            get { return (int)this["PageSize"]; }
        }

        /// <summary>
        /// Get value của tag
        /// </summary>
        /// <param name="key">Tên của tag</param>
        /// <returns></returns>
        public string GetValue(string key)
        {
            try
            {
                return (string)this[key];
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}

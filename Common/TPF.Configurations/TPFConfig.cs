using System.Configuration;

namespace TPF.Configurations
{
    public class TpfConfig
    {

        private static TPFConfigSection GetInstance()
        {
            // Note: Section name is the same with tag name in Web.config of web site
            // Ex: <TPF_Configuration configSource="TPF.config" />
            return (TPFConfigSection)ConfigurationManager.GetSection("TPF_Configuration");
        }

        public static DefaultElement Default
        {
            get
            {
                return GetInstance().DefaultElement;
            }
        }

    }
}

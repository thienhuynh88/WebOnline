
using System.Configuration;

namespace TPF.Configurations
{
    public class TPFConfigSection : ConfigurationSection
    {
        [ConfigurationProperty("Default")]
        public DefaultElement DefaultElement
        {
            get { return (DefaultElement)this["Default"]; }
        }
    }
}

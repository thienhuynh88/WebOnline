using log4net;

namespace TPF.Common.LogService
{
    public class Logger
    {
        private const string DEFAULT_LOGGER = "DefaultLogger";
        //private const string MAIL_LOGGER = "MailLogger";
        
        public static ILog DefaultLogger { get; set; }
        //public static ILog MailLogger { get; set; }

        static Logger()
        {
            //log4net.Config.XmlConfigurator.Configure();

            DefaultLogger = LogManager.GetLogger(DEFAULT_LOGGER);
            //MailLogger = LogManager.GetLogger(MAIL_LOGGER);
        }

    }

}
using System;

namespace TPF.Common.Utils
{
    public static class GenericStaticSingleton<T> where T : class
    {
        static volatile T _instance;
        static readonly object Lock = new object();

        static GenericStaticSingleton()
        {
        }

        public static T Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (Lock)
                    {
                        if (_instance == null)
                        {
                            _instance = Activator.CreateInstance<T>();
                        }
                    }
                }

                return _instance;
            }
        }
    }
}

using System;
using System.Reflection;

namespace TPF.Common.Utils
{
    public abstract class GenericAbstractSingleton<T> where T : class
    {
        //he volatile keyword indicates that a field can be modified in the program by something such as the operating system, the hardware, or a concurrently executing thread.
        static volatile T _instance;
        static readonly object Lock = new object();

        static GenericAbstractSingleton() { }

        public static T Instance
        {
            get
            {
                if (_instance == null)
                    lock (Lock)
                    {
                        if (_instance == null)
                        {
                            ConstructorInfo constructor;

                            // Binding flags exclude public constructors.
                            constructor = typeof(T).GetConstructor(BindingFlags.Instance |
                                          BindingFlags.NonPublic, null, new Type[0], null);

                            _instance = (T)constructor.Invoke(null);
                        }
                    }

                return _instance;
            }
        }
    }
}

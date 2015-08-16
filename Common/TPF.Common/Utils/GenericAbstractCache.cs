using System;
using System.Web;
using System.Web.Caching;
using TPF.Common.Extensions;

namespace TPF.Common.Utils
{
    /*
     * Question: What is the difference between Cache.Add and Cache.Add ?
     * Answer: 'Insert' will overwrite an existing cached value with the same Key, 'Add' fails if there is an existing cached value with the same key. 
        So there's a case for saying you should always use Insert since the first time the code runs it will put your object into the cache 
        and when it runs subsequently it will update the cached value.
     */

    /*
     * 1.
    /// dependencies
    /// absoluteExpiration = Cache.NoAbsoluteExpiration
    /// slidingExpiration  = Cache.NoSlidingExpiration
    /// CacheItemPriority  = CacheItemPriority.NotRemovable
    /// CacheItemRemovedCallback = null
    /// T: List<CustomerAddress>
    public class CacheTest : GenericAbstractCache< List<CustomerAddress>, CacheTest >
    {
        protected const string DependencyFilePath = "D:\\CacheDependency_CustomerAddress.txt";

        public CacheTest() : base(0,0, null, DependencyFilePath,() => CustomerAddressService.GetListCustomerAddress())
        {
            // Dữ liệu luôn có khi dùng CacheTest.Instance.Get()
        }
    }
     
      * 2.
    /// dependencies       = null
    /// absoluteExpiration = DateTime.Now.AddMinutes(minutesToElapse);
    /// slidingExpiration  = Cache.NoSlidingExpiration
    /// CacheItemPriority  = CacheItemPriority.NotRemovable
    /// CacheItemRemovedCallback = null
    /// T: List<CustomerAddress>
    public class CacheTest : GenericAbstractCache< UserLoginInfo, CacheTest >
    {
        public CacheTest() : base(20,0,null,null)
        {
            //Dữ liệu lúc này chưa có, ta phải load dữ liệu trước rồi push nó vô cache
            var data = new UserLoginInfo();
            data.Load();

            // Sau khi gọi hàm push dữ liệu sẽ được khởi tạo
            CacheTest.Instance.Push(data)
        }
    }
     */

    /// <summary>
    /// - Quản lý cache theo 2 cách:
    /// 1. Theo absoluteExpiration
    ///     + ex: absoluteExpiration = 20 phút -> thời gian expire = thời điểm tạo cache + 20 phút
    /// 2. Theo slidingExpiration
    ///     + ex: slidingExpiration = 20 phút -> thời gian expire = thời điểm truy cập + 20 phút
    /// - Nếu không truyền method để lấy dữ liệu thì sẽ gán object rỗng vô cache
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TP"></typeparam>
    public abstract class GenericAbstractCache<T, TP> : GenericAbstractSingleton<TP>
        where T : class
        where TP : class
    {
        private string cacheName = string.Empty;
        private string dependencyFilePath = string.Empty;
        private int minutesToElapse;
        private int minutesToSliding;
        private Func<T> generateObjectMethod = null;

        public GenericAbstractCache()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="minutesToElapse"> >0: dùng dạng absoluteExpiration</param>
        /// <param name="minutesToSliding"> >0: dùng dạng slidingExpiration</param>
        /// <param name="cacheName">Cho phép null. Nếu không truyền sẽ generate mặc định</param>
        /// <param name="dependencyFilePath">Cho phép null</param>
        public GenericAbstractCache(int minutesToElapse, int minutesToSliding, string cacheName = null, string dependencyFilePath = null)
        {
            if (cacheName == null)
                this.cacheName = string.Format("{0}-{1}", typeof(T).Name, Guid.NewGuid());
            else
                this.cacheName = cacheName;

            this.dependencyFilePath = dependencyFilePath;
            this.minutesToElapse = minutesToElapse;
            this.minutesToSliding = minutesToSliding;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="minutesToElapse"> >0: dùng dạng absoluteExpiration</param>
        /// <param name="minutesToSliding"> >0: dùng dạng slidingExpiration</param>
        /// <param name="cacheName">Cho phép null. Nếu không truyền sẽ generate mặc định</param>
        /// <param name="dependencyFilePath">Cho phép null</param>
        /// <param name="generateObjectMethod">Cho phép null bạn muốn khởi tạo cache rỗng trước, sau đó sẽ push object vào sau</param>
        public GenericAbstractCache(int minutesToElapse, int minutesToSliding, string cacheName = null, string dependencyFilePath = null, Func<T> generateObjectMethod = null)
        {
            if (cacheName == null)
                this.cacheName = string.Format("{0}-{1}", typeof(T).Name, Guid.NewGuid());
            else
                this.cacheName = cacheName;

            this.dependencyFilePath = dependencyFilePath;
            this.minutesToElapse = minutesToElapse;
            this.minutesToSliding = minutesToSliding;
            this.generateObjectMethod = generateObjectMethod;

            GetOrStore(generateObjectMethod);
        }

        public bool Exists()
        {
            return HttpRuntime.Cache[cacheName] != null;
        }

        /// <summary>
        /// Get Value từ cache nếu:
        /// - từ cache if nếu cache != null
        /// - else cache = null sẽ gọi function 'generateObjectMethod' để gẻ và gán lại cho cache
        /// </summary>
        /// <returns></returns>
        public T Get()
        {
            var obj = (T)HttpRuntime.Cache[this.cacheName];
            return obj ?? GetOrStore(generateObjectMethod);
        }

        /// <summary>
        /// Lưu data vô cache
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public void Push(T value)
        {
            GetOrStore(() => value);
        }

        private T GetOrStore(Func<T> itemGenerator)
        {
            CacheDependency dependencies = null;
            if (!string.IsNullOrEmpty(this.dependencyFilePath))
                dependencies = new CacheDependency(dependencyFilePath);

            //absoluteExpiration
            if (minutesToElapse > 0)
            {
                var absoluteExpiration = DateTime.Now.AddMinutes(minutesToElapse);
                return HttpRuntime.Cache.GetOrStore(
                                    cacheName,
                                    itemGenerator,
                                    dependencies,
                                    absoluteExpiration,
                                    Cache.NoSlidingExpiration,
                                    CacheItemPriority.Default,
                                    null);
            }

            //slidingExpiration
            if (minutesToSliding > 0)
            {
                var slidingExpiration = TimeSpan.FromMinutes(minutesToSliding);
                return HttpRuntime.Cache.GetOrStore(
                                    cacheName,
                                    itemGenerator,
                                    dependencies,
                                    Cache.NoAbsoluteExpiration,
                                    slidingExpiration,
                                    CacheItemPriority.Default,
                                    null);
            }

            return null;
        }

        /// <summary>
        /// Clears the value.
        /// </summary>
        public void Clear()
        {
            HttpRuntime.Cache.Remove(cacheName);
        }
    }
}

using System;
using System.Web;
using System.Web.Caching;
using TPF.Common.LogService;

namespace TPF.Common.Utils
{
    /*
     * Cách dùng
     * 
    public class BOCategoryCache : GenericStaticCache<List<BOCategory>>
    {
        public BOCategoryCache() : base(
            20,            
            ()=>ProductCategoryService.GetBOCategoryList(1),
            "Tên cache")
        {            
        }

        public static BOCategoryCache Instance
        {
            get { return SingletonBase<BOCategoryCache>.Instance; }
        }
    }
     */

    /// <summary>
    /// - Quản lý cache theo 2 cách:
    /// 1. có support Background Cache: lưu dạng absoluteExpiration và sẽ tự động lấy data khi cache bị expire hoặc phụ thuộc vào dependency
    ///     + ex: absoluteExpiration = 20 phút -> thời gian expire = thời điểm tạo cache + 20 phút
    /// 2. không support background cache: lưu dạng slidingExpiration
    ///     + ex: slidingExpiration = 20 phút -> thời gian expire = thời điểm truy cập + 20 phút
    /// - Lần đầu tiên khởi tạo sẽ gọi hàm Refresh để lấy dữ liệu và gán vô cache
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class GenericStaticCache<T> where T : class
    {
        private string cacheName = string.Empty;
        private Func<T> generateObjectMethod = null;
        private int minutesToElapseOrSliding = 0;
        private string dependencyFilePath = string.Empty;
        private bool supportBackgroundCache = false;
        private readonly object logObject = new object();

        public GenericStaticCache()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="minutesToElapseOrSliding">Thời gian dùng cho absoluteExpiration, slidingExpiration</param>
        /// <param name="generateObjectMethod">Hàm lấy data</param>
        /// <param name="supportBackgroundCache"></param>
        /// <param name="dependencyFilePath"></param>
        /// <param name="cacheName"></param>
        public GenericStaticCache(int minutesToElapseOrSliding, Func<T> generateObjectMethod, bool supportBackgroundCache = false, string dependencyFilePath = null, string cacheName = null)
        {
            this.minutesToElapseOrSliding = minutesToElapseOrSliding;
            if (cacheName == null)
                this.cacheName = string.Format("{0}-{1}", typeof(T).Name, Guid.NewGuid());
            else
                this.cacheName = cacheName;
            this.generateObjectMethod = generateObjectMethod;
            this.dependencyFilePath = dependencyFilePath;
            this.supportBackgroundCache = supportBackgroundCache;

            Refesh();
        }

        public bool Exists()
        {
            return Get() != null;
        }

        public T Get()
        {
            if (supportBackgroundCache)
            {
                return (T)HttpRuntime.Cache[string.Format("{0}-{1}", "BK", this.cacheName)];
            }
            else
            {
                var obj = (T)HttpRuntime.Cache[this.cacheName];
                if (obj == null)
                {
                    Refesh();
                    obj = (T)HttpRuntime.Cache[this.cacheName];
                }
                return obj;
            }
        }

        /// <summary>
        /// Pushes the value.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public void Push(T value)
        {
            SetValue(value);
        }

        /// <summary>
        /// Clears the value.
        /// </summary>
        public void Clear()
        {
            HttpRuntime.Cache.Remove(cacheName);
        }

        private void Refesh()
        {
            lock (logObject)
            {
                //Logger.DefaultLogger.InfoFormat("CacheName: {0}",this.cacheName);

                //Nếu không truyền method để lấy dữ liệu thì sẽ gán object rỗng vô cache
                if (generateObjectMethod != null)
                {
                    T obj = generateObjectMethod(); // heavy load    
                    SetValue(obj);
                }
                else
                {
                    SetValue(null);
                }
            }
        }

        private void SetValue(T value)
        {
            CacheDependency dependencies = null;
            if (!string.IsNullOrEmpty(this.dependencyFilePath))
                dependencies = new CacheDependency(dependencyFilePath);

            if (supportBackgroundCache)
            {
                // đối tượng này chứa dữ liệu thật sự
                HttpRuntime.Cache.Insert(
                         string.Format("{0}-{1}", "BK", this.cacheName),
                         value ?? new object(),
                         null, // luôn luôn phải gán null
                         System.Web.Caching.Cache.NoAbsoluteExpiration,
                         System.Web.Caching.Cache.NoSlidingExpiration,
                          CacheItemPriority.NotRemovable,
                         null);

                // đối tượng cache này chỉ dùng cho việc refresh lại cache và obj luôn luôn rỗng
                HttpRuntime.Cache.Insert(
                        this.cacheName,
                        new object(),
                        dependencies,
                        DateTime.Now.AddMinutes(minutesToElapseOrSliding),
                        Cache.NoSlidingExpiration,
                        CacheItemPriority.Default,
                        OnCacheRemove
                    );
            }
            else
            {
                // đối tượng cache này chỉ dùng cho việc refresh lại cache và obj luôn luôn rỗng
                HttpRuntime.Cache.Insert(
                    this.cacheName,
                    value ?? new object(),
                    dependencies,
                    Cache.NoAbsoluteExpiration,
                    TimeSpan.FromMinutes(minutesToElapseOrSliding),
                    CacheItemPriority.Default,
                    null
                );
            }
        }

        private void OnCacheRemove(string key, object cacheItem, CacheItemRemovedReason reason)
        {
            try
            {
                if (key == cacheName)//we must reload Cache
                {
                    Refesh();
                }
            }
            catch (Exception ex)
            {
                Logger.DefaultLogger.Error(ex);
            }
        }
    }
}

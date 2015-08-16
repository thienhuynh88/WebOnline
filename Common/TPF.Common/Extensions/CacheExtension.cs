using System;
using System.Web.Caching;

namespace TPF.Common.Extensions
{
    public static class CacheExtension
    {
        /*
     * Question: What is the difference between Cache.Add and Cache.Add ?
     * Answer: 'Insert' will overwrite an existing cached value with the same Key, 'Add' fails if there is an existing cached value with the same key. 
        So there's a case for saying you should always use Insert since the first time the code runs it will put your object into the cache 
        and when it runs subsequently it will update the cached value.
     -----------------------------------------------------
     * Ussage:
     * 1.
    var dependencies = new CacheDependency(Server.MapPath("myconfig.xml"));
    var user = HttpRuntime.Cache
                          .GetOrStore<User>(
                            string.Format("User{0}", _userId), 
                            () => Repository.GetUser(_userId),
                            dependencies);
     * 2.
     var minutesToElapse = 20;// in minutes
     var absoluteExpiration = DateTime.Now.AddMinutes(minutesToElapse);
     var user = HttpRuntime.Cache
                          .GetOrStore<User>(
                            string.Format("User{0}", _userId), 
                            () => Repository.GetUser(_userId),
                            absoluteExpiration);
     * 3. 
     var minutesToSliding = 20;// in minutes
     var slidingExpiration = TimeSpan.FromMinutes(minutesToSliding);
     var user = HttpRuntime.Cache
                          .GetOrStore<User>(
                            string.Format("User{0}", _userId), 
                            () => Repository.GetUser(_userId),
                            slidingExpiration);
     */

        private static object sync = new object();

        #region cache with generator function
        public static T GetOrStore<T>(this Cache cache, string key, Func<T> generator, CacheDependency dependencies)
        {
            return cache.GetOrStore(key, generator, dependencies, Cache.NoAbsoluteExpiration, Cache.NoSlidingExpiration, CacheItemPriority.NotRemovable, null);
        }

        /// <summary>
        /// - Hàm này lưu cache với thời gian quy định và sẽ expire sau khi hết thời gian đó
        ///     + ex: absoluteExpiration = 20 phút -> thời gian expire = thời điểm tạo cache + 20 phút
        /// </summary>
        /// <returns></returns>
        public static T GetOrStore<T>(this Cache cache, string key, Func<T> generator, DateTime absoluteExpiration)
        {
            return cache.GetOrStore(key, generator, null, absoluteExpiration, Cache.NoSlidingExpiration, CacheItemPriority.NotRemovable, null);
        }

        /// <summary>
        /// - Hàm này lưu cache với thời gian quy định và sẽ kéo dài thời gian nếu mình có dùng tới đối tượng cache
        ///     + ex: slidingExpiration = 20 phút -> thời gian expire = thời điểm truy cập + 20 phút
        /// </summary>
        /// <returns></returns>
        public static T GetOrStore<T>(this Cache cache, string key, Func<T> generator, TimeSpan slidingExpiration)
        {
            return cache.GetOrStore(key, generator, null, Cache.NoAbsoluteExpiration, slidingExpiration, CacheItemPriority.NotRemovable, null);
        }

        #endregion

        #region cache with object
        /// <summary>
        /// Hàm này lưu cache tồn tại mãi mãi
        /// Allows Caching of typed data. With:
        /// absoluteExpiration = Cache.NoAbsoluteExpiration
        /// slidingExpiration  = Cache.NoSlidingExpiration
        /// CacheItemPriority  = CacheItemPriority.NotRemovable
        /// CacheItemRemovedCallback = null
        /// </summary>
        /// <returns></returns>
        public static T GetOrStore<T>(this Cache cache, string key, T obj, CacheDependency dependencies)
        {
            return cache.GetOrStore(key, () => obj, dependencies, Cache.NoAbsoluteExpiration, Cache.NoSlidingExpiration, CacheItemPriority.NotRemovable, null);
        }

        /// <summary>
        /// - Hàm này lưu cache với thời gian quy định và sẽ expire sau khi hết thời gian đó
        ///     + ex: absoluteExpiration = 20 phút -> thời gian expire = thời điểm tạo cache + 20 phút
        /// - Allows Caching of typed data. With:
        /// dependencies       = null
        /// absoluteExpiration = DateTime
        /// slidingExpiration  = Cache.NoSlidingExpiration
        /// CacheItemPriority  = CacheItemPriority.NotRemovable
        /// CacheItemRemovedCallback = null
        /// </summary>
        /// <returns></returns>
        public static T GetOrStore<T>(this Cache cache, string key, T obj, DateTime absoluteExpiration)
        {
            return cache.GetOrStore(key, () => obj, null, absoluteExpiration, Cache.NoSlidingExpiration, CacheItemPriority.NotRemovable, null);
        }

        /// <summary>
        /// - Hàm này lưu cache với thời gian quy định và sẽ kéo dài thời gian nếu mình có dùng tới đối tượng cache
        ///     + ex: slidingExpiration = 20 phút -> thời gian expire = thời điểm truy cập + 20 phút
        /// - Allows Caching of typed data. With:
        /// dependencies       = null
        /// absoluteExpiration = DateTime
        /// slidingExpiration  = Cache.NoSlidingExpiration
        /// CacheItemPriority  = CacheItemPriority.NotRemovable
        /// CacheItemRemovedCallback = null
        /// </summary>
        /// <returns></returns>
        public static T GetOrStore<T>(this Cache cache, string key, T obj, TimeSpan slidingExpiration)
        {
            return cache.GetOrStore(key, () => obj, null, Cache.NoAbsoluteExpiration, slidingExpiration, CacheItemPriority.NotRemovable, null);
        }
        #endregion

        /// <summary>
        /// Allows Caching of typed data
        /// </summary>
        /// <example><![CDATA[
        /// var user = HttpRuntime
        ///   .Cache
        ///   .GetOrStore<User>(
        ///      string.Format("User{0}", _userId), 
        ///      () => Repository.GetUser(_userId),
        ///      new CacheDependency(Server.MapPath("myconfig.xml")));
        /// ]]></example>
        /// <typeparam name="T"></typeparam>
        /// <param name="cache">calling object</param>        
        /// <param name="key">The cache key used to reference the object.</param>
        /// <param name="itemGenerator">method or object to store in cache</param>
        /// <param name="dependencies">
        /// The file or cache key dependencies for the item. When any dependency changes,
        /// the object becomes invalid and is removed from the cache. If there are no
        /// dependencies, this parameter contains null.
        /// </param>
        /// <param name="absoluteExpiration">
        /// The time at which the inserted object expires and is removed from the cache.
        /// To avoid possible issues with local time such as changes from standard time
        /// to daylight saving time, use System.DateTime.UtcNow rather than System.DateTime.Now
        /// for this parameter value. If you are using absolute expiration, the slidingExpiration
        /// parameter must be System.Web.Caching.Cache.NoSlidingExpiration.
        ///</param>
        /// <param name="slidingExpiration">
        /// The interval between the time the inserted object was last accessed and the
        /// time at which that object expires. If this value is the equivalent of 20
        /// minutes, the object will expire and be removed from the cache 20 minutes
        /// after it was last accessed. If you are using sliding expiration, the absoluteExpiration
        /// parameter must be System.Web.Caching.Cache.NoAbsoluteExpiration.
        ///</param>
        /// <param name="priority">
        /// The cost of the object relative to other items stored in the cache, as expressed
        /// by the System.Web.Caching.CacheItemPriority enumeration. This value is used
        /// by the cache when it evicts objects; objects with a lower cost are removed
        /// from the cache before objects with a higher cost.
        ///</param>
        /// <param name="onRemoveCallback">
        /// onRemoveCallback:
        /// A delegate that, if provided, will be called when an object is removed from
        /// the cache. You can use this to notify applications when their objects are
        /// deleted from the cache.
        ///</param>
        /// <returns>T: obj</returns>
        public static T GetOrStore<T>(this Cache cache, string key, Func<T> itemGenerator, CacheDependency dependencies, DateTime absoluteExpiration, TimeSpan slidingExpiration, CacheItemPriority priority, CacheItemRemovedCallback onRemoveCallback)
        {
            var value = cache[key];

            if (value == null)
            {
                lock (sync)
                {
                    if (value != null) return (T)value;

                    // Nếu không truyền itemGenerator thì sẽ gán mặc định object rỗng

                    // Invoke the almighty itemGenerator to execute,
                    // and generate, the item that should be inserted
                    // into the cache.
                    value = itemGenerator != null ? itemGenerator.Invoke() : new object();

                    cache.Insert(key, value, dependencies, absoluteExpiration, slidingExpiration, priority,
                        onRemoveCallback);
                }
            }
            return (T)value;
        }
    }
}
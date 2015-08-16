using System;
using System.Web;

namespace TPF.Common.Utils
{
    /*
     * Ussage: 
     
     public class SessionUserLoginContext : GenericStaticSession<UserLoginInfo>
     {
        // Có thể thêm một số biến muốn dùng thêm cho class này
        public string Extra_Property1 { get; set; }
        public string Extra_Property2 { get; set; }

        private SessionUserLoginContext(): base()
        {
            // Khởi tạo dữ liệu cho các biến Extra_...
        }
      
        public static SessionUserLoginContext Instance
        {
            get { return GenericStaticSingleton<SessionUserLoginContext>.Instance; }
        }
     }
     
     public class UserLoginInfo
     {
        public long UserId { get;set; }
        public long UserName { get;set; }
     } 
     
     */

    /// <summary>
    /// Generic Session Class
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TP">The type of the P.</typeparam>
    public class GenericStaticSession<T> where T : class
    {
        private string sessionName = string.Empty;

        public GenericStaticSession()
        {
            sessionName = string.Format("{0}-{1}", typeof(T).Name, Guid.NewGuid());
        }

        public bool Exists()
        {
            return HttpContext.Current.Session[sessionName] != null;
        }

        /// <summary>
        /// Gets the object.
        /// </summary>
        /// <returns></returns>
        public T Get()
        {
            return (T)HttpContext.Current.Session[sessionName];
        }
        /// <summary>
        /// Pushes the value.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public void Push(T value)
        {
            HttpContext.Current.Session[sessionName] = value;
        }
        /// <summary>
        /// Clears the value.
        /// </summary>
        public void Clear()
        {
            HttpContext.Current.Session[sessionName] = null;
        }
    }
}

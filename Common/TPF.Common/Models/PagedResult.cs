using System;
namespace TPF.Common.Models
{
    public class PagedResult<T> where T : class
    {
        public int TotalItems { get; set; }
        public T Data { get; set; }
    }
}
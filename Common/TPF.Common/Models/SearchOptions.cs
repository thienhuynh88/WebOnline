using System;
using System.Collections.Generic;

namespace TPF.Common.Models
{
    public class SearchOptions
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public int skip { get; set; }
        public int take { get; set; }

        public List<KendoFilter> filter { get; set; }
        public List<KendoSortItem> sort { get; set; }
    }

    /*
     * Filter - Operators: 
        - Is equal to "eq"
        - Is not equal to "neq"
        - Starts with "startswith"
        - Contains "contains"
        - Does not contain "doesnotcontain"
        - Ends with "endswith"

        logic: "and"    "or"


     * Sort:
        Direction:  "asc"     "desc"
     */

    public class KendoFilter
    {
        public string field { get; set; }
        public KendoFilterLogic logic { get; set; }
        public List<KendoFilterItem> items { get; set; }
    }

    public class KendoFilterItem
    {
        public string value { get; set; }
        public KendoFilterOperator Operator { get; set; }
    }

    public class KendoSortItem
    {
        public string compare { get; set; }
        public KendoSortDirection dir { get; set; }
        public string field { get; set; }
    }

    public enum KendoFilterOperator
    {
        eq,
        neq,
        startswith,
        contains,
        doesnotcontain,
        endswith
    }

    public enum KendoFilterLogic
    {
        and,
        or
    }

    public enum KendoSortDirection
    {
        asc,
        desc
    }
}
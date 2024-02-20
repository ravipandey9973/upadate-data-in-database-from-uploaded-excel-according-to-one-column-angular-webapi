using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Master.Models
{
    public class Metricmaster
    {
        public int Id { get; set; }
        public int IsMandatory { get; set; }
        public List<int> metricid { get; set; }
    }
}
using Master.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Master.Controllers
{
    public class MetricmasterController : ApiController
    {
        public HttpResponseMessage Get()
        {
            string query = @" select Id,IsMandatory,metricid,name from dbo.Metricmaster";
            DataTable table = new DataTable();
            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["MasterAppDB"].ConnectionString))
            using (var cmd = new SqlCommand(query, con))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.Text;
                con.Open();
                da.Fill(table);
            }
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        public string Put([FromBody] Metricmaster d)
        {
            try
            {
                string query = @"
            UPDATE dbo.Metricmaster
            SET IsMandatory = CASE WHEN metricid IN ({0}) THEN 1 ELSE 0 END
        ";

              
                string paramList = string.Join(",", d.metricid);

                query = string.Format(query, paramList);

                using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["MasterAppDB"].ConnectionString))
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.CommandType = CommandType.Text;
                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return "Successfully updated";
            }
            catch (Exception ex)
            {
                return "Failed to Update: " + ex.Message;
            }
        }




    }

}

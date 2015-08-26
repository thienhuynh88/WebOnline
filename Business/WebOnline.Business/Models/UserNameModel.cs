using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Royalty.Data.Models;

namespace WebOnline.Business.Models
{
    public class UserNameModel
    {
        public int ID { get; set; }
        public string Username1 { get; set; }
        public string Password { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public int Sex { get; set; }
        public string SexString { get; set; }
        public Nullable<System.DateTime> Birthdate { get; set; }

        public string BirthDateString { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }

        public string Address { get; set; }
        public string Country { get; set; }
        public int Status { get; set; }
        public string Note { get; set; }
        public Nullable<int> DeptID { get; set; }

        public Nullable<int> Createby { get; set; }
        public Nullable<System.DateTime> Createday { get; set; }
        public Nullable<int> Updateby { get; set; }
        public Nullable<System.DateTime> Updateday { get; set; }

        public string CreateDayString { get; set; }

        public string UpdateDayString { get; set; }

        public string StatusString { get; set; }
        public string DeptString { get; set; }


        public int Day { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public static UserNameModel Parser(UserName data)
        {
            if (data != null)
            {
                var model = new UserNameModel();
                model.ID = data.ID;
                model.Fname = data.Fname ?? "";
                model.Lname = data.Lname ?? "";
                model.Username1 = data.Username1 ?? "";
                model.Password = data.Password ?? "";
                model.Email = data.Email ?? "";
                model.Sex = data.Sex ?? 1;
                model.Birthdate = data.Birthdate ?? null;
                model.Phone = data.Phone ?? "";
                model.Mobile = data.Mobile ?? "";
                model.Address1 = data.Address1 ?? "";
                model.Address2 = data.Address2 ?? "";
                model.Address3 = data.Address3 ?? "";
                model.Country = data.Country ?? "";
                model.Status = data.Status ?? 0;
                model.Note = data.Note ?? "";
                model.DeptID = data.DeptID ?? 1;
                model.Day = 1;
                model.Month = 1;
                model.Year = 1990;
                if (data.Birthdate.HasValue)
                {
                    var Temp = String.Format("{0:dd/MM/yyyy}", data.Birthdate.Value);
                    var arrtem = Temp.Split(Convert.ToChar("/"));
                    model.Day = int.Parse(arrtem[0]);
                    model.Month = int.Parse(arrtem[1]);
                    model.Year = int.Parse(arrtem[2]);

                }
                return model;
            }
            return null;
        }

        public UserName ToModel()
        {

            var model = new UserName();

            model.ID = this.ID;
            model.Fname = this.Fname ?? "";
            model.Lname = this.Lname ?? "";
            model.Username1 = this.Username1 ?? "";
            model.Password = this.Password ?? "";
            model.Email = this.Email??"";
            model.Sex = this.Sex;
            model.Birthdate = this.Birthdate ?? DateTime.Now;
            model.Phone = this.Phone ?? "";
            model.Mobile = this.Mobile ?? "";
            model.Address1 = this.Address1 ?? "";
            model.Address2 = this.Address2 ?? "";
            model.Address3 = this.Address3 ?? "";
            model.Country = this.Country ?? "";
            model.Status = this.Status;
            model.Note = this.Note ?? "";
            model.DeptID = this.DeptID;


            model.Createby = this.Createby;
            model.Createday = this.Createday;
            model.Updateby = this.Updateby;
            model.Updateday = this.Updateday;

            return model;

        }

    }
}

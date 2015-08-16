using System;
using System.IO;
using System.Security.Cryptography;

namespace TPF.Common.Utils
{
    public class Cryptography
    {
        private static byte[] KEY_64 = { 12, 46, 13, 156, 78, 4, 218, 39 };
        private static byte[] IV_64 = { 55, 13, 216, 79, 6, 19, 167, 98 };

        public static string Encrypt(string paramValue)
        {
            DESCryptoServiceProvider crypto = new DESCryptoServiceProvider();
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, crypto.CreateEncryptor(KEY_64, IV_64), CryptoStreamMode.Write);
            StreamWriter sw = new StreamWriter(cs);
            sw.Write(paramValue);
            sw.Flush();
            cs.FlushFinalBlock();
            ms.Flush();

            // convert back to a string
            return Convert.ToBase64String(ms.GetBuffer(), 0, (int)ms.Length);
        }

        public static string Decrypt(string paramValue)
        {
            DESCryptoServiceProvider crypto = new DESCryptoServiceProvider();
            byte[] buffer = Convert.FromBase64String(paramValue);
            MemoryStream ms = new MemoryStream(buffer);
            CryptoStream cs = new CryptoStream(ms, crypto.CreateDecryptor(KEY_64, IV_64), CryptoStreamMode.Read);
            StreamReader sr = new StreamReader(cs);
            return sr.ReadToEnd();
        }

        /// <summary>
        /// MD5
        /// </summary>
        public static string MD5(string input)
        {
            System.Text.UTF8Encoding ue = new System.Text.UTF8Encoding();
            byte[] bytes = ue.GetBytes(input);

            // encrypt bytes
            var md5 = new MD5CryptoServiceProvider();

            byte[] hashBytes = md5.ComputeHash(bytes);

            // Convert the encrypted bytes back to a string (base 16)
            string hashString = "";

            for (int i = 0; i < hashBytes.Length; i++)
            {
                hashString += Convert.ToString(hashBytes[i], 16).PadLeft(2, '0');
            }

            return hashString.PadLeft(32, '0');
        }
    }
}

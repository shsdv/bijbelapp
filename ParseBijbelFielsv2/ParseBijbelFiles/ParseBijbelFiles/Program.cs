using Newtonsoft.Json.Linq;
using RedBranch.Hammock;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
namespace ParseBijbelFiles
{
    class Program
    {
        static Connection c;
        public const string basePath = @"C:\Program Files (x86)\Bijbel\";
        static void Main(string[] args)
        {
            c = new Connection(new Uri("http://192.168.1.17:5984"));
            c.login("sander", "blabla");
            string[] folders = {"Bijbel", "Lied" };
            Session hoofdmenu = createOrOpenDb("hoofdmenu");
            removeAdditionalElements(hoofdmenu, folders.ToList());

            foreach (string folder in folders)
            {
                processFolder(hoofdmenu, folder);
            }

        }

        

        private static void processFolder(Session hoofdmenu, string folder)
        {
            string folderDbName = folder.ToLower();
            Dictionary<string, string> menuData = new Dictionary<string, string>();
            menuData.Add("dbname", folderDbName);
            menuData.Add("title", folder);
            createOrUpdateDocument(hoofdmenu, folder, menuData);
            Session folderDb = createOrOpenDb(folderDbName);
            List<string> ids = new List<string>();

            string[] files = Directory.GetFiles(basePath + folder, "*.boek");
            List<Tuple<string, string>> filesNew = new List<Tuple<string, string>>();
            foreach (string file in files)
            {
                if (Path.GetFileNameWithoutExtension(file) == "NBV")
                {
                    janFileReader reader = new janFileReader(folder, Path.GetFileNameWithoutExtension(file));

                    Tuple<Dictionary<string, string>, List<string>> boekFileContents = reader.readBoekFile();
                    filesNew.Add(Tuple.Create(file, boekFileContents.Item1["naam"]));
                }
            }

            filesNew.Sort((x, y) => string.Compare(x.Item2, y.Item2));

            for (int i = 0; i < filesNew.Count; i++)
            {
                string file = filesNew[i].Item1;
                string id = i.ToString("D" + filesNew.Count.ToString().Length) + "_" + Path.GetFileNameWithoutExtension(file);
                ids.Add(id);
                janFileReader reader = new janFileReader(folder, Path.GetFileNameWithoutExtension(file));

                Tuple<Dictionary<string, string>, List<string>> boekFileContents = reader.readBoekFile();

                Dictionary<string, string> saveData = new Dictionary<string, string>();
                string fileDbName = folderDbName + "_" + Path.GetFileNameWithoutExtension(filesNew[i].Item1).ToLower();
                saveData.Add("dbname", fileDbName);
                saveData.Add("title", boekFileContents.Item1["naam"]);
                createOrUpdateDocument(folderDb, id, saveData);
                processBoekFile(boekFileContents, fileDbName, reader);
            }
            removeAdditionalElements(folderDb, ids);
        }

        static void processBoekFile(Tuple<Dictionary<string, string>, List<string>> boekFileContents, string fileDbName, janFileReader reader)
        {
            Dictionary<int, Dictionary<int, List<janFileReader.Vers>>> IDX = reader.readIDX();
            Session fileDb = createOrOpenDb(fileDbName);
            List<string> ids = new List<string>();
            for (int i = 0; i < boekFileContents.Item2.Count; i++ )
            {
                string boekFileElement = boekFileContents.Item2[i];
                string id = i.ToString("D" + boekFileContents.Item2.Count.ToString().Length) + "_" + boekFileElement;
                ids.Add(id);
                Dictionary<string, string> data = new Dictionary<string, string>();
                data.Add("title", boekFileElement);
                string dbName = fileDbName + "_" + i.ToString();
                if (IDX.Count == 1)
                {
                    data.Add("contentDB", dbName);
                    data.Add("contentTitle", boekFileElement);
                    writeContentDB(dbName, IDX[1][i+1]);
                }
                else
                {
                    data.Add("dbname", dbName);
                    writeThirdMenu(dbName, IDX[i + 1], boekFileElement);
                }
                createOrUpdateDocument(fileDb, id, data);
                
            }

            removeAdditionalElements(fileDb, ids);
        }
        static void writeThirdMenu(string dbName, Dictionary<int, List<janFileReader.Vers>> contents, string name)
        {
            Session db = createOrOpenDb(dbName);
            List<string> ids = new List<string>();
            int total = contents.Count;
            foreach (KeyValuePair<int, List<janFileReader.Vers>> pair in contents)
            {
                string id = pair.Key.ToString("D" + total.ToString().Length);
                ids.Add(id);
                Dictionary<string, string> data = new Dictionary<string, string>();
                data.Add("title", pair.Key.ToString());
                string ContentDbName = dbName + "_" + id;
                data.Add("contentDB", ContentDbName);
                data.Add("contentTitle", name + " " + pair.Key.ToString());
                createOrUpdateDocument(db, id, data);
                writeContentDB(ContentDbName, pair.Value);
            }

            removeAdditionalElements(db, ids);
        }
        static void writeContentDB(string dbName, List<janFileReader.Vers> verses)
        {
            Session db = createOrOpenDb(dbName);
            List<string> ids = new List<string>();
            for (int i = 0; i < verses.Count; i++)
            {
                string id = i.ToString("D" + verses.Count.ToString().Length) + "_" + verses[i].versnummer;
                ids.Add(id);
                Dictionary<string, string> data = new Dictionary<string, string>();
                data.Add("text", verses[i].text);

                data.Add("nr", verses[i].versnummer.ToString());

                createOrUpdateDocument(db, id, data);
            }
            removeAdditionalElements(db, ids);
        }
        static Session createOrOpenDb(string name)
        {
            if (!c.ListDatabases().Contains(name))
                c.CreateDatabase(name);
            Session db =  c.CreateSession(name);
            db.ListEntities();
            return db;
        }
        static void createOrUpdateDocument(Session db, string id, Dictionary<string, string> fields)
        {
            JToken docNew = JToken.FromObject(fields);
            docNew["_id"] = id;
            if (db.IsEnrolled(id))
            {
                JToken doc = db.LoadRaw(id);
                bool same = true;
                foreach (KeyValuePair<string, string> field in fields)
                {
                    if (selectElement(doc, field.Key) != field.Value)
                    {
                        same = false;
                        doc[field.Key] = field.Value;
                    }
                }
                if (fields.Count != doc.Count() - 2)
                    same = false;

                if (!same)
                {
                    docNew["_rev"] = doc["_rev"];
                    db.SaveRaw(docNew);
                }
            }
            else
            {
                db.SaveRaw(docNew);
            }
        }
        static string selectElement(JToken doc, string fieldName)
        {
            if(doc[fieldName] != null)
                return doc[fieldName].ToString();

            return null;
        }
        static void recursivelyDeleteDoc(Session db, JToken doc)
        {
            string dbname = selectElement(doc, "dbname");
            if (dbname != null)
            {

                if (c.ListDatabases().Contains(dbname))
                {
                    Session databaseToDelete = c.CreateSession(dbname);
                    foreach (JToken element in databaseToDelete.ListEntities())
                    {
                        recursivelyDeleteDoc(databaseToDelete, element);
                    }
                    Console.WriteLine("Deleting database: " + dbname);
                    c.DeleteDatabase(dbname);
                }
            }
            Console.WriteLine("Deleting document: " + selectElement(doc, "_id"));
            
            db.Delete(doc);
        }
        private static void removeAdditionalElements(Session db, List<string> ids)
        {
            return;
            foreach (JToken doc in db.ListEntities())
            {
                if (!ids.Contains(selectElement(doc, "_id")))
                {
                    recursivelyDeleteDoc(db, doc);
                }
            }
        }
    }
}

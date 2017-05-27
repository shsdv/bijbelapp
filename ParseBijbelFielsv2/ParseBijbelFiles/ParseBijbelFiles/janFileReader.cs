using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text.RegularExpressions;

namespace ParseBijbelFiles
{
    class janFileReader
    {
        string folder;
        string afkorting;
        public janFileReader(string folder, string afkorting)
        {
            this.folder = folder;
            this.afkorting = afkorting;
        }
        public Dictionary<int, Dictionary<int, List<Vers>>> readIDX()
        {
            string[] linesIDX = File.ReadAllLines(getFilename("idx"));
            string text = File.ReadAllText(getFilename("dat"), Encoding.GetEncoding(1252));
            
            List<int> id1s = new List<int>();
            List<int> id2s = new List<int>();
            List<int> id3s = new List<int>();
            List<int> starts = new List<int>();
            for(int i = 0; i < linesIDX.Length; i++)
            {
                string line = linesIDX[i];
                if (line.Trim() != "")
                {
                    string[] splittedLine = line.Split('@');

                    starts.Add(int.Parse(splittedLine[0]));
                    id1s.Add(int.Parse(splittedLine[1]));
                    id2s.Add(int.Parse(splittedLine[2]));
                    id3s.Add(int.Parse(splittedLine[3]));
                    
                }
            }
            



            int prevId2 = id2s[0];
            int prevId1 = id1s[0];

            Dictionary<int, Dictionary<int, List<Vers>>> returnDict = new Dictionary<int, Dictionary<int, List<Vers>>>();
            List<Vers> currentVerses = new List<Vers>();
            Dictionary<int, List<Vers>> currentDict = new Dictionary<int, List<Vers>>();
            int startVers = -1;
            for (int i = 0; i < id1s.Count; i++)
            {
                if (id2s[i] == 12)
                {
                    Console.WriteLine("Test");
                }

                if (prevId2 != id2s[i] || prevId1 != id1s[i])
                {
                    currentDict.Add(prevId2, currentVerses);
                    currentVerses = new List<Vers>();
                }
                if (prevId1 != id1s[i])
                {
                    returnDict.Add(prevId1, currentDict);
                    currentDict = new Dictionary<int, List<Vers>>();
                }

                prevId2 = id2s[i];
                prevId1 = id1s[i];
                string versTekst = "";
                if (i != id1s.Count - 1)
                    versTekst = text.Substring(starts[i], starts[i + 1] - starts[i]);
                else
                    versTekst = text.Substring(starts[i]);


                int versnummer = id3s[i];
                if (versTekst == "")
                {
                    if(startVers == -1)
                        startVers = versnummer;
                    continue;
                }

                versTekst = Regex.Replace(versTekst, @"<[a-zA-Z]", m => string.Format(@"<my-{0}", m.Value.Substring(1)));
                versTekst = Regex.Replace(versTekst, @"</[a-zA-Z]", m => string.Format(@"</my-{0}", m.Value.Substring(2)));

                string versnummertekst = versnummer.ToString();
                if (startVers != -1)
                {
                    versnummertekst = startVers + "-" + versnummer;
                    startVers = -1;
                }
                string versTekstTemp = versTekst;
                string preVersTekst = "";
                while (versTekstTemp.Trim().StartsWith("<my-tussenkopje"))
                {
                    int changeIndex = versTekstTemp.IndexOf("</my-tussenkopje>") + "</my-tussenkopje>".Length;
                    preVersTekst = preVersTekst + versTekstTemp.Substring(0, changeIndex);
                    versTekstTemp = versTekstTemp.Substring(changeIndex);
                }
                versTekst = preVersTekst + "<sup>" + versnummertekst + "</sup>" + versTekstTemp;
                
                Vers vers = new Vers(versnummertekst, versTekst);
                currentVerses.Add(vers);
            }
            currentDict.Add(prevId2, currentVerses);
            returnDict.Add(prevId1, currentDict);
            return returnDict;
        }
        public class Vers
        {
            public string versnummer;
            public string text;

            public Vers(string versnummer, string text)
            {
                this.versnummer = versnummer;
                this.text = text;
            }
        }
        
        public Tuple<Dictionary<string, string>, List<string>> readBoekFile()
        {
            string[] FileContents = File.ReadAllLines(getFilename("boek"), Encoding.GetEncoding(1252));
            List<string> contents = new List<string>();
            Dictionary<string, string> boekInfo = new Dictionary<string, string>();
            bool startReadingContents = false;
            foreach (string line in FileContents)
            {
                if (!startReadingContents && !line.StartsWith("===="))
                {
                    string[] splittedLine = line.Split('=');
                    boekInfo.Add(splittedLine[0], splittedLine[1]);
                }
                if (startReadingContents && line.Trim() != "")
                {
                    contents.Add(line.Trim());
                }

                if (line.StartsWith("===="))
                {
                    startReadingContents = true;
                }
            }

            return Tuple.Create(boekInfo, contents);
        }
        private string getFilename(string extension)
        {
            return Program.basePath + this.folder + "//" + this.afkorting + "." +  extension;
        }
    }
}

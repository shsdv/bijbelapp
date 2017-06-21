package Synchronizing;

/**
 * Created by sgeluk on 20-6-2017.
 */


import android.app.ProgressDialog;
import android.content.*;
import android.os.AsyncTask;
import android.widget.ListView;

import java.net.*;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.HashMap;
import java.util.SortedMap;
import java.io.*;
import java.util.ArrayList;

import com.bijbelappontwikkeling.bijbelapp.R;
import com.bijbelappontwikkeling.bijbelapp.TreeMapAdapter;
import com.owlike.genson.*;
import com.owlike.genson.Context;

public class SyncProvider {
    private static ArrayList<String> mainMenuSyncs = new ArrayList<String>();
    private static HashMap<String, TreeMap<String, HashMap<String, Object>>> syncedDbs = new HashMap<String, TreeMap<String, HashMap<String, Object>>>();
    public static void login(final String username, final String password) {
        Authenticator.setDefault(new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password.toCharArray());
            }
        });

    }

    public static String getDb(String dbname, String query) {
        String baseURL = "https://bijbelapp.duckdns.org:5984/";
        URL url;
        InputStream is = null;
        BufferedReader br;
        String output = "";
        try {
            url = new URL(baseURL + dbname + "/" + query);
            is = url.openStream(); // throws an IOException
            br = new BufferedReader(new InputStreamReader(is));
            StringBuilder sb = new StringBuilder();
            int cp;
            while ((cp = br.read()) != -1) {
                sb.append((char) cp);
            }
            output = sb.toString();

        } catch (MalformedURLException mue) {
            mue.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
            try {
                if (is != null)
                    is.close();
            } catch (IOException ioe) {
                // nothing to see here
            }
        }
        return output;
    }
    private static TreeMap<String, HashMap<String, Object>> getDocs(String dbname, String extraQuery){
        Genson deserializer = new Genson();
        TreeMap<String, ArrayList<HashMap<String, Object>>> allInfo = deserializer.deserialize(getDb(dbname, "_all_docs?include_docs=true" + extraQuery), TreeMap.class);
        if(allInfo == null)
            return null;
        ArrayList<HashMap<String, Object>> rows = allInfo.get("rows");
        TreeMap<String, HashMap<String, Object>> map = new TreeMap<String, HashMap<String, Object>>();
        for(int i = 0; i < rows.size(); i++){
            String id =(String) rows.get(i).get("id");
            if(!id.startsWith("_")){
                map.put(id, (HashMap<String, Object>) rows.get(i).get("doc"));
            }
        }
        return map;
    }
    public static SortedMap<String, HashMap<String, Object>> getAllDocs(String dbname){
        if(syncedDbs.containsKey(dbname)){
            return syncedDbs.get(dbname);
        } else {
            return getDocs(dbname, "");
        }
    }
    public static SortedMap<String, HashMap<String, Object>> getSubsetOfDocs(String dbname, String startkey, String endkey){
        if(syncedDbs.containsKey(dbname)) {
            return syncedDbs.get(dbname).subMap(startkey, endkey);
        } else {
            try {
                return getDocs(dbname, "&startkey=" + URLEncoder.encode("\"" + startkey + "\"", "UTF-8") + "&endkey=" + URLEncoder.encode("\"" + endkey + "\"", "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                return null;
            }
        }
    }
    public final static String SyncMainMenusDbName = "_MainMenus";
    private static void SyncMainMenus() {
        addSync("hoofdmenu");
        mainMenuSyncs.add("hoofdmenu");
        SortedMap<String, HashMap<String, Object>> docs = SyncProvider.getAllDocs("hoofdmenu");
        if(docs == null)
            return;
        for(Map.Entry<String, HashMap<String, Object>> doc : docs.entrySet()) {
            String subdb = (String)doc.getValue().get("dbname");
            addSync(subdb);
            mainMenuSyncs.add(subdb);
        }
    }
    public static boolean isSynct(String dbname) {
        return syncedDbs.containsKey(dbname);
    }
    public static boolean isSyncable(String dbname) {
        return !mainMenuSyncs.contains(dbname);
    }

    public static Boolean addSync(String dbname) {
        TreeMap<String, HashMap<String, Object>> docs =getDocs(dbname, "");
        if(docs != null) {
            syncedDbs.put(dbname, docs);
            return true;
        }
        return false;
    }

    public static void removeSync(String dbname) {
        syncedDbs.remove(dbname);
    }

    public static class runSyncTask extends AsyncTask<String, Integer, Boolean> {
        final ProgressDialog dialog;
        private String dbname;
        public runSyncTask(android.content.Context context) {
            dialog = new ProgressDialog(context);
            dialog.setMessage("Synchroniseren...");
            dialog.setIndeterminate(true);
            dialog.setCancelable(false);
        }
        protected void onPreExecute(){
            dialog.show();
        }
        protected Boolean doInBackground(String... args) {
            SyncProvider.login("wJvPUP", "bOlwofshNZuobBqmhF2bPgZb");
            dbname = args[0];
            if(SyncMainMenusDbName.equals(dbname))
                SyncMainMenus();
            else
                addSync(dbname);
            return true;
        }
        protected void onPostExecute(Boolean result) {
            dialog.hide();
        }
    }

}
package com.bijbelappontwikkeling.bijbelapp;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ListView;

import java.util.HashMap;
import java.util.Set;
import java.util.SortedMap;

import Synchronizing.SyncProvider;

public class Menu extends AppCompatActivity {
    public final static String EXTRA_DBNAME = "dbname";
    public final static String EXTRA_STARTKEY = "startkey";
    public final static String EXTRA_ENDKEY = "endkey";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);
        Intent intent = getIntent();
        new downloadMenuItems(this).execute(intent.getStringExtra(EXTRA_DBNAME),
                intent.getStringExtra(EXTRA_STARTKEY),
                intent.getStringExtra(EXTRA_ENDKEY));
    }


    private class downloadMenuItems extends AsyncTask<String, Integer, SortedMap<String, HashMap<String, Object>>> {
        private Context mContext;
        private String dbname;
        public downloadMenuItems(Context context) {
            mContext = context;
        }
        protected SortedMap<String, HashMap<String, Object>> doInBackground(String... args) {
            SyncProvider.login("wJvPUP", "bOlwofshNZuobBqmhF2bPgZb");
            dbname = args[0];
            if(dbname == null)
                dbname = "hoofdmenu";
            if(args[1] == null)
                return SyncProvider.getAllDocs(dbname);
            else
                return SyncProvider.getSubsetOfDocs(dbname, args[1], args[2]);
        }
        protected void onPostExecute(SortedMap<String, HashMap<String, Object>> result) {
            Set<String> keySetSet = result.keySet();
            String[] keySet = keySetSet.toArray(new String[0]);
            TreeMapAdapter adapter = new TreeMapAdapter(this.mContext, keySet, result, dbname);
            ListView listview = (ListView) findViewById(R.id.listview);
            listview.setAdapter(adapter);
        }
    }

}

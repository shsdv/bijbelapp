package com.bijbelappontwikkeling.bijbelapp;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;
import android.widget.ListView;
import android.widget.TextView;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;

import Synchronizing.SyncProvider;

public class Content extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_content);
        Intent intent = getIntent();
        new Content.downloadContent(this).execute(intent.getStringExtra(Menu.EXTRA_DBNAME),
                intent.getStringExtra(Menu.EXTRA_STARTKEY),
                intent.getStringExtra(Menu.EXTRA_ENDKEY));
    }


    private class downloadContent extends AsyncTask<String, Integer, SortedMap<String, HashMap<String, Object>>> {
        private Context mContext;
        private String dbname;
        public downloadContent(Context context) {
            mContext = context;
        }
        protected SortedMap<String, HashMap<String, Object>> doInBackground(String... args) {
            SyncProvider.login("wJvPUP", "bOlwofshNZuobBqmhF2bPgZb");
            dbname = args[0];
            return SyncProvider.getSubsetOfDocs(dbname, args[1], args[2]);
        }
        protected void onPostExecute(SortedMap<String, HashMap<String, Object>> result) {
            StringBuilder sb = new StringBuilder();
            for(Map.Entry<String, HashMap<String, Object>> entry : result.entrySet()) {
                sb.append(entry.getValue().get("text"));
            }
            WebView txt = (WebView)findViewById(R.id.contentWebview);
            txt.loadData(sb.toString(), "text/html", null);
        }
    }
}

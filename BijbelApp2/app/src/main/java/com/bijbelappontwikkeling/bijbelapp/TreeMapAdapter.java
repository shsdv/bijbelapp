package com.bijbelappontwikkeling.bijbelapp;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import android.widget.Toast;

import java.util.HashMap;
import java.util.SortedMap;
import java.util.TreeMap;

public class TreeMapAdapter extends ArrayAdapter<String> {
    private final Context context;
    private final String[] keys;
    private final String[] values;
    private final SortedMap<String, HashMap<String, Object>> mData;
    private final String currentDbName;
    public static class ViewHolder {
        String key;
        TextView textView;
    }


    public TreeMapAdapter(Context context, String[] mKeys,SortedMap<String, HashMap<String, Object>> data, String currentDbName) {
        super(context, R.layout.menu_row, mKeys);
        this.context = context;
        this.keys = mKeys;
        this.currentDbName = currentDbName;
        mData  = data;
        values = new String[data.size()];
        int counter = 0;
        for(HashMap<String, Object> entry : data.values()) {
            values[counter] = (String)entry.get("title");
            counter = counter + 1;
        }
    }
    public int getCount() {

        return mData.size();

    }

    public String getItem(int position) {

        return (String) values[position];
    }


    public long getItemId(int arg0) {

        return arg0;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {

        ViewHolder holder = null;
        if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.menu_row,
                    parent, false);
            holder = new ViewHolder();
            holder.textView = (TextView) convertView.findViewById(R.id.label);
            holder.key = keys[position];
            convertView.setTag(holder);

        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        holder.textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("Clicked!");
                String key = keys[position];
                HashMap<String, Object> doc = mData.get(key);
                String dbname = (String) doc.get("dbname");
                if(dbname == null)
                    dbname = currentDbName;

                String startkey = (String) doc.get("startkey");
                String endkey = (String) doc.get("endkey");
                System.out.println("dbname: " + dbname + " startkey: " + startkey + " endkey: " + endkey + " nextIsContent" + doc.get("nextIsContent"));
                Intent intent;
                if(doc.get("nextIsContent") != null && doc.get("nextIsContent").equals("1")) {
                    intent = new Intent(context, Content.class);
                } else {
                    intent = new Intent(context, Menu.class);
                }
                intent.putExtra(Menu.EXTRA_DBNAME, dbname);
                intent.putExtra(Menu.EXTRA_STARTKEY, startkey);
                intent.putExtra(Menu.EXTRA_ENDKEY, endkey);
                context.startActivity(intent);
            }
        });
        holder.textView.setText(values[position]);
        return convertView;
    }
}


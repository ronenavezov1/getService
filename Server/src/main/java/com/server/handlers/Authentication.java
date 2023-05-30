package com.server.handlers;

import com.server.storage.QueryHandler;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


public class Authentication {
    private static final List<String> cities = generatCitiesList();
    private static List<String> generatCitiesList(){
        Iterator<Object> iterator = QueryHandler.getCities("").iterator();
        List<String> cities = new ArrayList<String>();
        while (iterator.hasNext()){
            JSONObject next = (JSONObject) (iterator.next());
            cities.add((String) next.get("name"));
        }
        return cities;
    }
    public static boolean isCityExist(String city){
        return cities.contains(city);
    }
    public static boolean isNullOrEmpty(String... strings){
        for (String string : strings) {
            if (string == null || string.isEmpty())
                return true;
        }
        return false;
    }
}

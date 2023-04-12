package com.server.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.server.storage.StorageManager;

public class UserHandler {

    private static Gson gson = new GsonBuilder().serializeNulls().create();

    public static String getUser(String idToken) {
        try {
            String email = GoogleApiHandler.getEmail(idToken);
            return gson.toJson(StorageManager.getUser(email));
        } catch (Exception e) {
            return null;
        }
    }

    public static void createUser(String idToken) {
        try {
            String email = GoogleApiHandler.getEmail(idToken);
            // TODO: add all fields
            // User user = new User(UUID.randomUUID(), email, firstName, lastName);
            // StorageManager.addUser(user);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

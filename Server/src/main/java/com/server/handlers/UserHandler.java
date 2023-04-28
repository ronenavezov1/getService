package com.server.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.server.exceptions.InvalidUserException;
import com.server.models.User;
import com.server.models.Worker;
import com.server.storage.QueryHandler;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.security.GeneralSecurityException;

public class UserHandler {

    private static final Gson gson = new GsonBuilder().serializeNulls().create();

    public static String getUser(String idToken) {
        try {
            String email = GoogleApiHandler.getEmail(idToken);
            return gson.toJson(QueryHandler.getUser(email));
        } catch (Exception e) {
            return null;
        }
    }

    public static void createUser(String idToken, String body) throws InvalidUserException {
        try {
            String email = GoogleApiHandler.getEmail(idToken);
            if(Authentication.isNullOrEmpty(email))
                throw new InvalidUserException("Unreachable email");
            Gson gson = new Gson();
            User user;
            JSONObject jsonObject = new JSONObject(body);
            String type = jsonObject.getString("type");
            if (Authentication.isNullOrEmpty(type)){
                throw new InvalidUserException("Missing type");
            }
            switch (type) {
                case "worker":
                    user = gson.fromJson(body, Worker.class);
                    break;
                case "user":
                    user = gson.fromJson(body, User.class);
                    break;
                default:
                    throw new InvalidUserException("Unknown user type " + type);
            }

            user.setEmail(email);
            if(user instanceof Worker && Authentication.isNullOrEmpty(((Worker) user).getProfession())) {
                throw new InvalidUserException("Missing profession");
            }
            if (QueryHandler.insertUser(user)) {
                if (user instanceof Worker) {
                    QueryHandler.addWorkerProfession(user.getId().toString(), ((Worker) user).getProfession());
                }
            }

        } catch (GeneralSecurityException | IOException e) {
            throw new InvalidUserException(e.getMessage());
        }
    }

}

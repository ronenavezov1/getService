package com.server.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.server.exceptions.InvalidUserException;
import com.server.models.User;
import com.server.models.Worker;
import com.server.storage.QueryHandler;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.UUID;

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
            //create and check what missing
            JsonArray missing = new JsonArray();
            boolean ifMissing = false;
            Gson gson = new Gson();
            User user;
            String email = GoogleApiHandler.getEmail(idToken);
            JSONObject jsonObject = null;
            try {
                jsonObject = new JSONObject(body);
            } catch (JSONException e){
                throw new InvalidUserException("not in json format");
            }
            String type = null;
            try{
                type = jsonObject.getString("type");
            }catch (JSONException e){
                missing.add("missing type");
                ifMissing = true;
            }
            if (type != null && type.equals("worker")) {
                user = gson.fromJson(body, Worker.class);
            } else {
                user = gson.fromJson(body, User.class);
            }
            if(Authentication.isNullOrEmpty(email)){
                missing.add("unreachable email");
                ifMissing = true;
            }
            if(Authentication.isNullOrEmpty(user.getFirstName())){
                missing.add("missing first name");
                ifMissing = true;
            }
            if(Authentication.isNullOrEmpty( user.getLastName())){
                missing.add("missing last name");
                ifMissing = true;
            }
            if(Authentication.isNullOrEmpty(user.getAddress())){
                missing.add("missing address");
                ifMissing = true;
            }
            if(Authentication.isNullOrEmpty(user.getCity())){
                missing.add("missing city");
                ifMissing = true;
            }
            if(user.getPhoneNumber() == 0){
                missing.add("missing phone number");
                ifMissing = true;
            }
            if(user instanceof Worker && Authentication.isNullOrEmpty(((Worker) user).getProfession())) {
                missing.add("missing profession");
                ifMissing = true;
            }
            if(ifMissing)
                throw new InvalidUserException(missing.toString());

            //add
            user.setId(UUID.randomUUID());
            user.setEmail(email);
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

package com.server.handlers;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonSyntaxException;
import com.server.exceptions.InvalidUserException;
import com.server.models.User;
import com.server.models.Worker;
import com.server.storage.QueryHandler;
import org.json.JSONException;
import org.json.JSONObject;

import javax.annotation.Nullable;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

public class UserHandler {

    public static User getUser(String idToken) {
        try {
            String email = GoogleApiHandler.getEmail(idToken);
            User user = QueryHandler.getUser(email);
            if (user.getType() != null && user.getType().equals(User.WORKER)) {
                user = new Worker(
                        user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getAddress(), user.getCity(),
                        user.getPhoneNumber(), user.getType(), user.isApproved(), user.isOnBoardingCompleted(),
                        QueryHandler.getWorkerProfession(user.getId().toString())
                );
            }
            return user;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static User createUser(String idToken, String body) throws InvalidUserException {
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
            try {
                type = jsonObject.getString("type");
            } catch (JSONException e){
                missing.add("missing type");
                ifMissing = true;
            }
            try {
                if (type != null && type.equals(User.WORKER)) {
                    user = gson.fromJson(body, Worker.class);
                } else if(type != null && type.equals(User.CUSTOMER)){
                    user = gson.fromJson(body, User.class);
                    user.setApproved(true);
                } else if (type != null && type.equals(User.ADMIN)) {
                    throw new InvalidUserException("cannot sign up as admin");
                } else {
                    throw new InvalidUserException("illegal type");
                }
            }catch (JsonSyntaxException e){
                throw new InvalidUserException(e.getMessage());
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
            if(user instanceof Worker && ((Worker) user).getProfession().isEmpty()) {
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
                    for (String profession: ((Worker) user).getProfession()) {
                        QueryHandler.addWorkerProfession(user.getId().toString(), profession);
                    }
                }
            }

            return user;

        } catch (GeneralSecurityException | IOException | SQLException e) {
            throw new InvalidUserException(e.getMessage());
        }
    }

    public static List<User> getUsers(@Nullable String isApproved, @Nullable String isOnBoardingCompleted, @Nullable String firstName, @Nullable String lastName, @Nullable  String type) {
        try {
            if (Strings.isNullOrEmpty(isApproved)) {
                isApproved = "";
            }
            if (Strings.isNullOrEmpty(isOnBoardingCompleted)) {
                isOnBoardingCompleted = "";
            }
            if (Strings.isNullOrEmpty(firstName)) {
                firstName = "";
            }
            if (Strings.isNullOrEmpty(lastName)) {
                lastName = "";
            }
            if (Strings.isNullOrEmpty(type)) {
                type = "";
            }
            return QueryHandler.getUsers(
                    isApproved,
                    isOnBoardingCompleted,
                    firstName,
                    lastName,
                    type
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    static public void setApproved(String userId, boolean isApproved) throws SQLException {
        QueryHandler.setApproved(userId, isApproved);
    }

}

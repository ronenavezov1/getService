package com.server.storage;

import com.server.models.User;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.UUID;

public class QueryHandler {
    
    // USER
    public static boolean insertUser(User user) {
        try {
            return StorageManager.executeUpdate(Queries.INSERT_USER,
                    (statement) -> {
                        statement.setString(1, user.getId().toString());
                        statement.setString(2, user.getEmail());
                        statement.setString(3, user.getFirstName());
                        statement.setString(4, user.getLastName());
                        statement.setString(5, user.getAddress());
                        statement.setString(6, user.getCity());
                        statement.setLong(7, user.getPhoneNumber());
                        statement.setString(8, user.getType());
                        statement.setBoolean(9, user.isApproved());
                    }
            ) == 1;
        }catch (SQLException e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * fail if email not exists or city not in list
     * @param email
     * @return return User on succeed, null otherwise
     */
    public static User getUser(final String email) {
        final User[] user = new User[1];
        try {
            StorageManager.executeQuery(Queries.SELECT_USER_BY_EMAIL, (statement)->{
                statement.setString(1, email);
            }, (resultSet)->{
                if (resultSet.next()){
                    UUID id = (UUID) resultSet.getObject("user_id");
                    String firstName = resultSet.getString("first_name");
                    String lastName = resultSet.getString("last_name");
                    String address = resultSet.getString("address");
                    String city = resultSet.getString("city");
                    long phone = resultSet.getLong("phone");
                    boolean isApproved = resultSet.getBoolean("is_approved");
                    boolean isOnBoardingCompleted = resultSet.getBoolean("is_onboarding_completed");
                    String type = resultSet.getString("type");
                    user[0] = new User(id, email, firstName, lastName, address, city, phone, type, isOnBoardingCompleted, isApproved);
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
        return user[0];
    }

    public static boolean updateUser(String firstName, String lastName, long phoneNumber, String address, String city, String id, String type) {
        try {
            return StorageManager.executeUpdate(Queries.UPDATE_USER, (statement) -> {
                statement.setString(1, firstName);
                statement.setString(2, lastName);
                statement.setString(3, address);
                statement.setString(4, city);
                statement.setLong(5, phoneNumber);
                statement.setString(6, type);
                statement.setString(7, id);
            }) == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // WORKER
    public static boolean addWorkerProfession(String id, String profession) {
        try {
            return StorageManager.executeUpdate(Queries.INSERT_WORKER, (statement) -> {
                statement.setString(1, id);
                statement.setString(2, profession);
            }) == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean updateWorkerProfession(String id, String profession) {
        try {
            return StorageManager.executeUpdate(Queries.UPDATE_WORKER, (statement) -> {
                statement.setString(1, id);
                statement.setString(2, profession);
            }) == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // CITY
    public static String getCities(String startWith){
        JSONArray jsonFiles = new JSONArray();
        try{
            StorageManager.executeQuery(Queries.SELECT_CITY,
                    (statement) -> {
                        statement.setString(1, startWith);
                    },
                    (resultSet) -> {
                        while (resultSet.next()) {
                            JSONObject jsonObject = new JSONObject();
                            jsonObject.put("name", resultSet.getString(1));
                            jsonFiles.put(jsonObject);
                        }
                    });
        } catch (SQLException e) {
            return jsonFiles.toString();
        }
        return jsonFiles.toString();
    }

    // TODO: do we still need this code? yes if I need add more cities from file and I use same code if we wont add professional
    //[{"name":"lod"}]
    public static void addCitiesFromJsonFile(File file){
        JSONArray jsonFiles = null;
        try(FileInputStream fileInputStream = new FileInputStream(file)){
            try(Reader reader = new InputStreamReader(fileInputStream, StandardCharsets.UTF_8);){
                try(BufferedReader bufferedReader = new BufferedReader(reader)){
                    String line;
                    StringBuilder s = new StringBuilder();
                    while ((line = bufferedReader.readLine()) != null) {
                        s.append(line);
                    }
                    jsonFiles = new JSONArray(s.toString());
                }catch (IOException e){
                    throw new RuntimeException(e);
                }
            }catch (IOException e){
                throw new RuntimeException(e);
            }

        } catch (SecurityException | IOException e){
            throw new RuntimeException(e);
        }
        if(!jsonFiles.isEmpty()){
            for (int i = 0; i < jsonFiles.length(); i++) {
                JSONArray finalJsonFiles = jsonFiles;
                int finalI = i;
                try {
                    StorageManager.executeQuery(Queries.INSERT_CITY, (statement) -> {
                        statement.setString(1, (String)finalJsonFiles.getJSONObject(finalI).get("name"));
                    }, (resultSet)->{});
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}


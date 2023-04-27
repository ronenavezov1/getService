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
        return StorageManager.executeUpdate(Queries.INSERT_USER,
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getAddress(),
                user.getCity(),
                user.getPhoneNumber(),
                user.getType(),
                user.isApproved()
        );
    }

    public static User getUser(String email) throws SQLException {
        try {
            ResultSet rs = StorageManager.executeQuery(Queries.SELECT_USER_BY_EMAIL, email);
            if (rs.next()) {
                UUID id = (UUID) rs.getObject("user_id");
                String firstName = rs.getString("first_name");
                String lastName = rs.getString("last_name");
                String address = rs.getString("address");
                String city = rs.getString("city");
                String phone = rs.getString("phone");
                boolean isApproved = rs.getBoolean("is_approved");
                boolean isOnBoardingCompleted = rs.getBoolean("is_onboarding_completed");
                String type = rs.getString("type");
                return new User(id, email, firstName, lastName, address, city, phone, type, isOnBoardingCompleted, isApproved);
            }
        } catch (SQLException e) {
            throw e;
        }
        return new User();
    }

    public static boolean updateUser(String firstName, String lastName, long phoneNumber, String address, String city, String id, String type) {
        return StorageManager.executeUpdate(Queries.UPDATE_USER, firstName, lastName, address, city, phoneNumber, type, id);
    }

    // WORKER

    public static boolean addWorkerProfession(String id, String profession) {
        return StorageManager.executeUpdate(Queries.INSERT_WORKER, id, profession);
    }

    public static boolean updateWorkerProfession(String id, String profession) {
        return StorageManager.executeUpdate(Queries.UPDATE_WORKER, profession, id);
    }

    // CITY
    public static String getCities(String startWith){
        JSONArray jsonFiles = new JSONArray();
        try(ResultSet resultSet = StorageManager.executeQuery(Queries.SELECT_CITY, startWith)){
            while (resultSet.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("name", resultSet.getString(1));
                jsonFiles.put(jsonObject);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jsonFiles.toString();
    }

    // TODO: do we still need this code?
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
                StorageManager.executeQuery(Queries.INSERT_CITY, (String) jsonFiles.getJSONObject(i).get("name"));
            }
        }
    }
}


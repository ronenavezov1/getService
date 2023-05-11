package com.server.storage;

import com.server.models.Call;
import com.server.models.User;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

public class QueryHandler {

    // CALL
    public static Call getCall(String callId){
        AtomicReference<Call> call = new AtomicReference<>();
        try {
            StorageManager.executeQuery(Queries.GET_CALL, statement -> {
                statement.setString(1, callId);
            }, resultSet -> {
                call.set(new Call(
                        UUID.fromString(resultSet.getString(1)),
                        UUID.fromString(resultSet.getString(2)),
                        resultSet.getString(3),
                        resultSet.getString(4),
                        resultSet.getString(5),
                        resultSet.getString(6)
                ));
            });
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
        return call.get();
    }
    public static boolean updateCall(Call call){
        try {
            return StorageManager.executeUpdate(Queries.UPDATE_CALL, statement -> {
                statement.setString(1, call.getService());
                statement.setString(2, call.getDescription());
                statement.setString(3, call.getAddress());
                statement.setString(4, call.getCity());
                statement.setString(5, call.getCallId().toString());
            }) == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean updatePickCall(String callId, String workerId, String status, long expectedArrival) throws Exception {
        try {
            return StorageManager.executeUpdate(Queries.UPDATE_PICK_CALL, statement -> {
                statement.setString(1, workerId);
                statement.setString(2, status);
                statement.setLong(3, expectedArrival);
                statement.setString(4, callId);
            }) == 1;
        } catch (SQLException e) {
            throw new Exception("Error updating call: " + callId + " error: " + e.getMessage());
        }
    }

    public static boolean deleteCall(String callId, String userId, boolean isAdmin){
        try {
            return StorageManager.executeUpdate(Queries.DELETE_CALL, statement -> {
                statement.setString(1, callId);
                statement.setString(2, userId);
                statement.setBoolean(3, isAdmin);
            }) == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public static String getCalls(String callId, String customerId, String workerId, String status, String city) {
        JSONArray jsonArray = new JSONArray();
        try{
            StorageManager.executeQuery(Queries.GET_CALLS, (statement)->{
                statement.setString(1, callId);
                statement.setString(2, customerId);
                statement.setString(3, workerId);
                statement.setString(4, city);
                statement.setString(5, status);
            }, (resultSet) -> {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", resultSet.getString(1));

                User customer = getUser((UUID)resultSet.getObject(2));
                JSONObject userObject = new JSONObject();
                if(customer == null)
                {
                    userObject.put("id", "undefine");
                }else {
                    userObject.put("id", customer.getId().toString());
                    userObject.put("firstName", customer.getFirstName());
                    userObject.put("lastName", customer.getLastName());
                }
                jsonObject.put("customer", userObject);
                jsonObject.put("service", resultSet.getString(4));
                jsonObject.put("description", resultSet.getString(5));
                jsonObject.put("status", resultSet.getString(7));
                jsonObject.put("address", resultSet.getString(9));
                jsonObject.put("city", resultSet.getString(10));
                jsonObject.put("creationTime", Call.SIMPLE_DATE_FORMAT.format(new Date(resultSet.getLong(11))));
                if(resultSet.getString(7) != null && !resultSet.getString(7).equals(Call.OPEN_CALL)) {
                    User worker = getUser((UUID)resultSet.getObject(3));
                    JSONObject workerObject = new JSONObject();
                    if(worker == null) {
                        jsonObject.put("id", "undefine");
                    }else {
                        workerObject.put("id", worker.getId().toString());
                        workerObject.put("firstName", worker.getFirstName());
                        workerObject.put("lastName", worker.getLastName());
                    }
                    jsonObject.put("worker", workerObject);
                    jsonObject.put("expectedArrival", Call.SIMPLE_DATE_FORMAT.format(new Date(resultSet.getLong(12))));
                }
                if(resultSet.getString(7) != null && resultSet.getString(7).equals(Call.CLOSE_CALL)) {
                    jsonObject.put("rate", resultSet.getFloat(8));
                    jsonObject.put("comment", resultSet.getString(6));
                }
                jsonArray.put(jsonObject);
            });
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
        return jsonArray.toString();
    }
    public static boolean createCall(Call call){
        try {
            StorageManager.executeUpdate(Queries.CREATE_CALL, (statement)->{
                statement.setString(1, call.getCallId().toString());
                statement.setString(2, call.getCustomerId().toString());
                statement.setString(3, call.getService());
                statement.setString(4, call.getDescription());
                statement.setString(5, call.getComment());
                statement.setString(6, call.getStatus());
                statement.setString(7, call.getAddress());
                statement.setString(8, call.getCity());
                statement.setLong(9, call.getCreationTime());
            });
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
    
    // USER
    public static boolean insertUser(User user) throws SQLException {
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
        } catch (SQLException e){
            throw e;
        }
    }

    /**
     * fail if email not exists or city not in list
     * @return return User on succeed, null otherwise
     */
    public static User getUser(final String email){
        final User[] user = new User[1];
        user[0] = new User();
        try {
            StorageManager.executeQuery(Queries.SELECT_USER_BY_EMAIL, (statement)->{
                statement.setString(1, email);
            }, (resultSet) -> {
                UUID id = (UUID) resultSet.getObject("user_id");
                String firstName = resultSet.getString("first_name");
                String lastName = resultSet.getString("last_name");
                String address = resultSet.getString("address");
                String city = resultSet.getString("city");
                long phone = resultSet.getLong("phone");
                boolean isApproved = resultSet.getBoolean("is_approved");
                boolean isOnBoardingCompleted = resultSet.getBoolean("is_onboarding_completed");
                String type = resultSet.getString("type");
                user[0] = new User(id, email, firstName, lastName, address, city, phone, type, isApproved, isOnBoardingCompleted);
            });
        } catch (SQLException e) {
            return null;
        }
        return user[0];
    }

    /**
     * fail if email not exists or city not in list
     * @return return User on succeed, null otherwise
     */
    public static User getUser(final UUID userId){
        final User[] user = new User[1];
        user[0] = new User();
        try {
            StorageManager.executeQuery(Queries.SELECT_USER_BY_UUID, (statement)->{
                statement.setString(1, userId.toString());
            }, (resultSet) -> {
                UUID id = (UUID) resultSet.getObject("user_id");
                String firstName = resultSet.getString("first_name");
                String email = resultSet.getString("email");
                String lastName = resultSet.getString("last_name");
                String address = resultSet.getString("address");
                String city = resultSet.getString("city");
                long phone = resultSet.getLong("phone");
                boolean isApproved = resultSet.getBoolean("is_approved");
                boolean isOnBoardingCompleted = resultSet.getBoolean("is_onboarding_completed");
                String type = resultSet.getString("type");
                user[0] = new User(id, email, firstName, lastName, address, city, phone, type, isApproved, isOnBoardingCompleted);
            });
        } catch (SQLException e) {
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
    public static void addWorkerProfession(String id, String profession) throws SQLException {
        try {
            StorageManager.executeUpdate(Queries.INSERT_WORKER, (statement) -> {
                statement.setString(1, id);
                statement.setString(2, profession);
            });
        } catch (SQLException e) {
            throw e;
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
    public static JSONArray getCities(String startWith){
        JSONArray jsonFiles = new JSONArray();
        try{
            StorageManager.executeQuery(Queries.SELECT_CITY,
                    (statement) -> {
                        statement.setString(1, startWith);
                    },
                    (resultSet) -> {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("name", resultSet.getString(1));
                        jsonFiles.put(jsonObject);
                    });
        } catch (SQLException e) {
            return jsonFiles;
        }
        return jsonFiles;
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


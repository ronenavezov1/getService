package com.server.storage;

import com.server.models.User;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.UUID;

public class StorageManager {
    private static final String POSTGRESQL_NAME = "jdbc/postgres";
    private static javax.sql.DataSource ds = null;

    private static Connection getConnection() throws SQLException {
        if (ds == null) {
            Context initContext = null;
            try {
                initContext = new InitialContext();
                Context envContext = (Context) initContext.lookup("java:/comp/env");
                ds = (javax.sql.DataSource) envContext.lookup(POSTGRESQL_NAME);

            } catch (NamingException e) {
                e.printStackTrace();
            }
        }
        return ds.getConnection();
    }

    public static void addUser(User user) {
        try (Connection connection = getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(Queries.INSERT_USER)) {
                statement.setString(1, user.getEmail());
                statement.setString(2, user.getFirstName());
                statement.setString(3, user.getLastName());
                // TODO: add all fields
                statement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static User getUser(String email) {
        User user = new User();
        try (Connection connection = getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(Queries.SELECT_USER_BY_EMAIL)) {
                statement.setString(1, email);
                ResultSet rs = statement.executeQuery();
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
                    user = new User(id, email, firstName, lastName, address, city, phone, type, isOnBoardingCompleted, isApproved);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return user;
    }

    public static String getCities(String startWith){
        JSONArray jsonFiles = new JSONArray();
        try(Connection conn = getConnection()){
            try(PreparedStatement statement = conn.prepareStatement(
                        "SELECT name " +
                            "FROM public.city " +
                            "WHERE starts_with(public.city.name, ?)\n" +
                            "ORDER BY name ASC ")){
                statement.setString(1, startWith);
                try(ResultSet resultSet = statement.executeQuery()){
                    while (resultSet.next()) {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("name", resultSet.getString(1));
                        jsonFiles.put(jsonObject);
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jsonFiles.toString();
    }

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
            try(Connection connection = getConnection()){
                for (int i = 0; i < jsonFiles.length(); i++) {
                    try(PreparedStatement statement = connection.prepareStatement("insert into city values (?)")){
                        statement.setString(1, (String) jsonFiles.getJSONObject(i).get("name"));
                        statement.executeUpdate();
                    }catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }
}


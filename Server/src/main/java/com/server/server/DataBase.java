package com.server.server;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
public class DataBase {
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


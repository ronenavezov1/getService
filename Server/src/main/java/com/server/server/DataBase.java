package com.server.server;

import javax.activation.DataSource;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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

    public static String test(){
        try(Connection conn = getConnection()){
            try(PreparedStatement statement = conn.prepareStatement("SELECT name FROM public.city\n" +
                    "ORDER BY name ASC ")){
                try(ResultSet resultSet = statement.executeQuery()){
                    if (resultSet.next())
                        return resultSet.getString(1);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return "nan";
    }
}

package com.server.storage;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

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
    public static boolean executeUpdate(String query, Object... args) {
        try (Connection connection = getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                int idx = 1;
                for (Object arg: args) {
                    if (arg instanceof String) {
                        statement.setString(idx, (String) arg);
                    }
                    idx++;
                }
                return statement.executeUpdate() == 1;
            } catch (SQLException e) {
                throw e;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static ResultSet executeQuery(String query, Object... args) {
        try (Connection connection = getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                int idx = 1;
                for (Object arg: args) {
                    if (arg instanceof String) {
                        statement.setString(idx, (String) arg);
                    }
                    idx++;
                }
                return statement.executeQuery();
            } catch (SQLException e) {
                throw e;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}

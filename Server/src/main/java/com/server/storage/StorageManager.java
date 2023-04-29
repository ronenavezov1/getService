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
    public static int executeUpdate(String query, Statements statements) throws SQLException {
        try (Connection connection = getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                statements.onPreparedStatement(statement);
                return statement.executeUpdate();
            }
        }
    }

    public static void executeQuery(String query, Statements statements, Results results) throws SQLException {
        try (Connection connection = getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                statements.onPreparedStatement(statement);
                try (ResultSet resultSet = statement.executeQuery()){
                    while (resultSet.next())
                        results.onResultSet(resultSet);
                }
            }
        }
    }

    interface Statements{
        void onPreparedStatement(PreparedStatement statement) throws SQLException;
    }
    interface Results{
        void onResultSet(ResultSet resultSet) throws SQLException;
    }
}

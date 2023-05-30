package com.server.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class Configuration {

    public static final String GOOGLE_CLIENT_ID = "google.client_id";
    public static final String EMAIL_USER_NAME = "email.username";
    public static final String EMAIL_PASSWORD = "email.password";


    private Map<String, String> configurationMap = new HashMap<>();

    private static Configuration configuration = null;

    private Configuration() {
        loadConfig();
    }

    public static synchronized Configuration getInstance() {
        if (configuration == null)
            configuration = new Configuration();
        return configuration;
    }

    private void loadConfig() {
        try {
            Properties prop = new Properties();
            InputStream input = getClass().getClassLoader().getResourceAsStream("config.properties");
            prop.load(input);
            configurationMap.put(GOOGLE_CLIENT_ID, prop.getProperty(GOOGLE_CLIENT_ID));
            configurationMap.put(EMAIL_USER_NAME, prop.getProperty(EMAIL_USER_NAME));
            configurationMap.put(EMAIL_PASSWORD, prop.getProperty(EMAIL_PASSWORD));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String getGoogleClientId() {
        return configurationMap.get(GOOGLE_CLIENT_ID);
    }

    public String getEmailUserName() {
        return configurationMap.get(EMAIL_USER_NAME);
    }

    public String getEmailPassword() {
        return configurationMap.get(EMAIL_PASSWORD);
    }

}

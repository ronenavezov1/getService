package com.server.handlers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.server.config.Configuration;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

public class GoogleApiHandler {
    private static Configuration configuration = Configuration.getInstance();
    private static GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
            .setAudience(Collections.singletonList(configuration.getGoogleClientId()))
            .build();

    public static String getEmail(String idTokenString) throws GeneralSecurityException, IOException {
        Payload payload = getPayload(idTokenString);
        return payload != null ? payload.getEmail() : null;
    }

    public static void verify(String idTokenString) throws Exception {
        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new Exception();
        }
    }

    private static Payload getPayload(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = verifier.verify(idTokenString);
        return idToken != null ? idToken.getPayload() : null;
    }
}

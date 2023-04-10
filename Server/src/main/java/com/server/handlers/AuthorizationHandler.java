package com.server.handlers;


import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.GeneralSecurityException;

public class AuthorizationHandler {

    public static String authorize(HttpServletRequest request) throws IOException, GeneralSecurityException {
        String idToken = request.getHeader("Authorization");
        GoogleApiHandler.verify(idToken);
        return idToken;
    }
}

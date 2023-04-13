package com.server.handlers;


import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.GeneralSecurityException;

public class AuthorizationHandler {

    /**
     * returns token on null if not pass GeneralSecurity
     * @param request
     * @return
     * @throws IOException
     * @throws GeneralSecurityException
     */
    public static String authorize(HttpServletRequest request){
        String idToken = request.getHeader("Authorization");
        if (Authentication.isNullOrEmpty(idToken))
            return null;
        try {
            GoogleApiHandler.verify(idToken);
            return idToken;
        } catch (Exception e) {
            return null;
        }
    }
}

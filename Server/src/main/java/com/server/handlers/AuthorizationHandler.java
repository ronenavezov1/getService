package com.server.handlers;


import com.server.exceptions.InvalidUserException;
import com.server.models.User;
import com.server.storage.QueryHandler;

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
    public static String authorizeByGoogle(HttpServletRequest request){
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

    public static User authorizeUser(HttpServletRequest request) throws IOException, InvalidUserException {
        String idToken = AuthorizationHandler.authorizeByGoogle(request);
        if (idToken == null) {
            throw new InvalidUserException("User is not authorized by google. Try to sign in again.");
        }
        String email;
        try {
            email = GoogleApiHandler.getEmail(idToken);
        } catch (GeneralSecurityException e) {
            throw new InvalidUserException("Error retrieving email from token by google: " + e.getMessage());
        }
        User user = QueryHandler.getUser(email);
        if (user == null){
            throw new InvalidUserException("User does not exist");
        }
        if (!user.isApproved()){
            throw new InvalidUserException("User is not approved by admin");
        }
        return user;
    }
}

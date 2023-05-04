package com.server.server;

import com.server.exceptions.InvalidUserException;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.UserHandler;
import com.server.utils.ErrorResponse;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet(name = "onBoardingServlet", value = "/onBoarding")
public class onBoardingServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        String idToken = AuthorizationHandler.authorizeByGoogle(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse("User is not authorized by google. Try to sign in again.", HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }

        BufferedReader reader = request.getReader();
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        try {
            UserHandler.createUser(idToken, sb.toString());
        } catch (InvalidUserException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

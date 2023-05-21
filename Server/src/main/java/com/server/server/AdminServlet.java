package com.server.server;

import com.server.exceptions.InvalidUserException;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.UserHandler;
import com.server.utils.ErrorResponse;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

@WebServlet(name = "AdminServlet", value = "/users")
public class AdminServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            AuthorizationHandler.authorizeUser(request, Arrays.asList("admin"));
        } catch (InvalidUserException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }

        String isApproved = request.getParameter("isApproved");
        String isOnBoardingCompleted = request.getParameter("isOnBoardingCompleted");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String type = request.getParameter("type");

        response.getWriter().print(UserHandler.getUsers(isApproved, isOnBoardingCompleted, firstName, lastName, type));
    }
}

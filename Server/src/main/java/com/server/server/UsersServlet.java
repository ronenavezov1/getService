package com.server.server;

import com.server.handlers.AuthorizationHandler;
import com.server.handlers.UserHandler;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

@WebServlet(name = "UsersServlet", value = "/user/*", loadOnStartup = 1)
public class UsersServlet extends HttpServlet {

    @Override
    public void init() throws ServletException {
        super.init();
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");

        String idToken;
        try {
            idToken = AuthorizationHandler.authorize(request);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(e.getMessage());
            return;
        }

        String requestURI = request.getRequestURI();
        if (Authentication.isNullOrEmpty(requestURI))
            return;
        int lastIndexOfForwardSlash = requestURI.lastIndexOf('/');
        if (lastIndexOfForwardSlash == -1)
            return;
        String action = requestURI.substring(lastIndexOfForwardSlash + 1);
        if (action.isEmpty())
            return;
        switch (action) {
            case "user":
                getUser(response, idToken);
            default:
                return;
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");

        String idToken;
        try {
            idToken = AuthorizationHandler.authorize(request);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(e.getMessage());
            return;
        }

        String requestURI = request.getRequestURI();
        if (Authentication.isNullOrEmpty(requestURI))
            return;
        int lastIndexOfForwardSlash = requestURI.lastIndexOf('/');
        if (lastIndexOfForwardSlash == -1)
            return;
        String action = requestURI.substring(lastIndexOfForwardSlash + 1);
        if (action.isEmpty())
            return;
        switch (action) {
            case "user":
                createUser(response, idToken);
            default:
                return;
        }
    }

    public void destroy() {
    }

    private void getUser(HttpServletResponse response, String idToken) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().print(UserHandler.getUser(idToken));
    }

    private void createUser(HttpServletResponse response, String idToken) throws IOException {
        UserHandler.createUser(idToken);
    }
}

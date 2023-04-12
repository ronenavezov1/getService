package com.server.server;

import com.server.handlers.Authentication;
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
                getUser(request, response);
            default:
                return;
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
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
                createUser(request, response);
            default:
                return;
        }
    }

    private void getUser(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if(idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String user = UserHandler.getUser(idToken);
        if(Authentication.isNullOrEmpty(user)){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        response.getWriter().print(user);
    }

    private void createUser(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if(idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        UserHandler.createUser(idToken);
    }

    @Override
    public void destroy() {
    }
}

package com.server.server;

import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.UserHandler;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

@WebServlet(name = "UsersServlet", value = "/user")
public class UsersServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if(idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String user = UserHandler.getUser(idToken);
        if(Authentication.isNullOrEmpty(user)){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        response.getWriter().print(user);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String idToken = AuthorizationHandler.authorize(request);
        if(idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        UserHandler.createUser(idToken);
    }
}

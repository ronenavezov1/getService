package com.server.server;

import org.json.JSONArray;

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
            default:
                return;
        }
    }

    public void destroy() {
    }
}
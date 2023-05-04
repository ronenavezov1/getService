package com.server.server;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.UserHandler;
import com.server.utils.ErrorResponse;

import java.io.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

@WebServlet(name = "UsersServlet", value = "/user")
public class UsersServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String idToken = AuthorizationHandler.authorizeByGoogle(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse("User is not authorized by google. Try to sign in again.", HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }
        response.getWriter().print(UserHandler.getUser(idToken));
    }
}

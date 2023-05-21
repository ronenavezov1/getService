package com.server.server;

import com.server.exceptions.InvalidUserException;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.UserHandler;
import com.server.utils.ErrorResponse;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Arrays;

@WebServlet(name = "WorkerServlet", value = "/approveUser")
public class ApproveServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        try {
            AuthorizationHandler.authorizeUser(request, Arrays.asList("admin"));
        } catch (InvalidUserException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }

        String userId = request.getParameter("id");

        BufferedReader reader = request.getReader();
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        boolean isApproved;
        try {
            JSONObject jsonObject = new JSONObject(sb.toString());
            isApproved = jsonObject.getBoolean("isApproved");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("isApproved is not set properly", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }
        try {
            UserHandler.setApproved(userId, isApproved);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }
}

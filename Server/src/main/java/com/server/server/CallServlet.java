package com.server.server;

import com.server.exceptions.InvalidCallException;
import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.CallHandler;
import com.server.storage.QueryHandler;
import org.apache.http.entity.ContentType;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet(name = "CallServlet", value = "/call")
public class CallServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        response.setContentType(ContentType.TEXT_PLAIN.toString());
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");
        String callId = request.getParameter("id");
        String customerId = request.getParameter("customerId");
        String workerId = request.getParameter("workerId");
        String status = request.getParameter("status");
        String city = request.getParameter("city");
        if(status == null)
            status = "";
        if(!Authentication.isNullOrEmpty(callId)){
            response.getWriter().print(QueryHandler.getCallById(callId));
        } else if (!Authentication.isNullOrEmpty(customerId)) {
            response.getWriter().print(QueryHandler.getCallByCustomerId(customerId, status));
        } else if (!Authentication.isNullOrEmpty(workerId)) {
            response.getWriter().print(QueryHandler.getCallByWorkerId(workerId, status));
        } else if (!Authentication.isNullOrEmpty(city)) {
            response.getWriter().print(QueryHandler.getCallByCity(city, status));
        } else if (!Authentication.isNullOrEmpty(status)) {
            response.getWriter().print(QueryHandler.getCallByStatus(status));
        }
    }

    @Override
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {

    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        response.setContentType(ContentType.TEXT_PLAIN.toString());
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");
        BufferedReader reader = request.getReader();
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        try {
            CallHandler.creatCall(sb.toString());
        }   catch (InvalidCallException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(e.getMessage());
        }
    }

    @Override
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

    }

}

package com.server.server;

import com.server.exceptions.InvalidCallException;
import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.CallHandler;
import com.server.models.Call;
import com.server.storage.QueryHandler;
import org.apache.http.entity.ContentType;
import org.json.JSONObject;

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
        if(city == null)
            city = "";
        if(callId == null)
            callId = "";
        if(customerId == null)
            customerId = "";
        if(workerId == null)
            workerId = "";

        String responseString = QueryHandler.getCalls(callId, customerId, workerId, status, city);
        if(responseString != null)
            response.getWriter().print(responseString);
        else
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }

    @Override
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        request.setCharacterEncoding("UTF-8");
        String city = request.getParameter("city");
        String callId = request.getParameter("id");
        String service = request.getParameter("service");
        String description = request.getParameter("description");
        String address = request.getParameter("address");

        if(!Authentication.isNullOrEmpty(callId) && !CallHandler.updateCall(callId, city, service, description, address))
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
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
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String callId = request.getParameter("id");
        if(!Authentication.isNullOrEmpty(callId) && !QueryHandler.deleteCall(callId))
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }

}

package com.server.server;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.server.exceptions.InvalidCallException;
import com.server.exceptions.InvalidUserException;
import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.CallHandler;
import com.server.models.Call;
import com.server.models.User;
import com.server.storage.QueryHandler;
import com.server.utils.ErrorResponse;

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
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        User user;
        try {
            user = AuthorizationHandler.authorizeUser(request);
            if(user.getId() == null)
                throw new InvalidUserException("missed user id");
        } catch (InvalidUserException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }
        if(Authentication.isNullOrEmpty(user.getType())) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("user's type undefined", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }

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
        String responseString = null;
        switch (user.getType()) {
            case User.WORKER:
                responseString = QueryHandler.getCalls(callId, customerId, user.getId().toString(), status, city);
                break;
            case User.CUSTOMER:
                responseString = QueryHandler.getCalls(callId, user.getId().toString(), workerId, status, city);
                break;
            case User.ADMIN:
                responseString = QueryHandler.getCalls(callId, customerId, workerId, status, city);
                break;
        }
        if(responseString != null)
            response.getWriter().print(responseString);
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("oops something goes wrong", HttpServletResponse.SC_BAD_REQUEST));
        }
    }

    @Override
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        User user;
        try {
            user = AuthorizationHandler.authorizeUser(request);
            if(user.getId() == null)
                throw new InvalidUserException("missed user id");
        } catch (InvalidUserException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }
        if(Authentication.isNullOrEmpty(user.getType())) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("user's type undefined", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }
        request.setCharacterEncoding("UTF-8");

        String city = request.getParameter("city");
        String callId = request.getParameter("id");
        String service = request.getParameter("service");
        String description = request.getParameter("description");
        String address = request.getParameter("address");

        if(Authentication.isNullOrEmpty(callId)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("call id not given", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }

        try {
            if((user.getType().equals(User.CUSTOMER))) {
                CallHandler.updateCall(callId, city, service, description, address, user.getId().toString());
            } else if(user.getType().equals(User.ADMIN)){
                CallHandler.updateCall(callId, city, service, description, address, User.ADMIN);
            }else{
                throw new InvalidCallException("you not allow to edit this call");
            }
        } catch (InvalidCallException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        User user;
        try {
            user = AuthorizationHandler.authorizeUser(request);
            if(user.getId() == null)
                throw new InvalidUserException("missed user id");
        } catch (InvalidUserException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }

        BufferedReader reader = request.getReader();
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        Call call;
        Gson gson = new Gson();
        try {
            call = gson.fromJson(sb.toString(), Call.class);
        }catch (JsonSyntaxException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
            return;
        }
        if (call.getCustomerId() == null || !call.getCustomerId().toString().equals(user.getId().toString())) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(new ErrorResponse("customer id not much to your user", HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
            return;
        }
        try {
            CallHandler.creatCall(call);
        }   catch (InvalidCallException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }

    @Override
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        User user;
        try {
            user = AuthorizationHandler.authorizeUser(request);
            if(user.getId() == null)
                throw new InvalidUserException("missed user id");
        } catch (InvalidUserException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(new ErrorResponse(e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED));
            return;
        }
        if(Authentication.isNullOrEmpty(user.getType())) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("user's type undefined", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }

        String callId = request.getParameter("id");
        if(Authentication.isNullOrEmpty(callId)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("call id not given", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }

        if(!QueryHandler.deleteCall(callId, user.getId().toString(), user.getType().equals(User.ADMIN))){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print(new ErrorResponse("call not exist", HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }

}

package com.server.server;

import com.server.exceptions.InvalidCallException;
import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.CallHandler;
import com.server.handlers.GoogleApiHandler;
import com.server.models.User;
import com.server.storage.QueryHandler;
import org.apache.http.entity.ContentType;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.security.GeneralSecurityException;

@WebServlet(name = "CallServlet", value = "/call")
public class CallServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String email;
        try {
            email = GoogleApiHandler.getEmail(idToken);
        } catch (GeneralSecurityException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"not found email from token\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        User user = QueryHandler.getUser(email);
        if(user == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not exist\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        if(!user.isApproved()){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not approved\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        if(user.getType() == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user's type not defined\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
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
            response.getWriter().print("{\"message\":\"oops something goes wrong\",\n\"statusCode\":\""+HttpServletResponse.SC_BAD_REQUEST+"\"}");
        }
    }

    @Override
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String email;
        try {
            email = GoogleApiHandler.getEmail(idToken);
        } catch (GeneralSecurityException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"not found email from token\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        User user = QueryHandler.getUser(email);
        if(user == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not exist\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        if(!user.isApproved()){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not approved\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
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
            response.getWriter().print("{\"message\":\"call id not found\",\n\"statusCode\":\""+HttpServletResponse.SC_BAD_REQUEST+"\"}");
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
            response.getWriter().print("{\"message\":\"" + e.getMessage() + "\",\n\"statusCode\":\""+HttpServletResponse.SC_INTERNAL_SERVER_ERROR+"\"}");
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String email;
        try {
            email = GoogleApiHandler.getEmail(idToken);
        } catch (GeneralSecurityException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"not found email from token\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        User user = QueryHandler.getUser(email);
        if(user == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not exist\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        if(!user.isApproved()){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not approved\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
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
            response.getWriter().print("{\"message\":\"" + e.getMessage() + "\",\n\"statusCode\":\""+HttpServletResponse.SC_INTERNAL_SERVER_ERROR+"\"}");
        }
    }

    @Override
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if (idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String email;
        try {
            email = GoogleApiHandler.getEmail(idToken);
        } catch (GeneralSecurityException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"not found email from token\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        User user = QueryHandler.getUser(email);
        if(user == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not exist\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        if(!user.isApproved()){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"message\":\"user not approved\",\n\"statusCode\":\""+HttpServletResponse.SC_UNAUTHORIZED+"\"}");
            return;
        }
        String callId = request.getParameter("id");
        if(Authentication.isNullOrEmpty(callId)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"message\":\"call id not found\",\n\"statusCode\":\""+HttpServletResponse.SC_BAD_REQUEST+"\"}");
            return;
        }
/*        if((user.getType().equals(User.CUSTOMER))) {todo:
            CallHandler.deleteCall(callId, city, service, description, address, user.getId().toString());
        } else if(user.getType().equals(User.ADMIN)){
            CallHandler.deleteCall(callId, city, service, description, address, User.ADMIN);
        }else{
            throw new InvalidCallException("you not allow to edit this call");
        }*/
        if(!QueryHandler.deleteCall(callId)){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"message\":\"call not exist\",\n\"statusCode\":\""+HttpServletResponse.SC_INTERNAL_SERVER_ERROR+"\"}");
        }
    }

}

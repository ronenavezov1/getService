package com.server.server;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.server.EmailSender;
import com.server.exceptions.InvalidCallException;
import com.server.exceptions.InvalidUserException;
import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.CallHandler;
import com.server.models.Call;
import com.server.models.User;
import com.server.storage.QueryHandler;
import com.server.utils.ErrorResponse;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

import static com.server.utils.Constants.*;
import static com.server.utils.Constants.DONE_MSG;

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
        if(customerId == null)
            customerId = "";
        if(workerId == null)
            workerId = "";
        if (callId == null) {
            callId = "";
        }

        String responseString = CallHandler.getCalls(user, callId, status, city, customerId, workerId);

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
        request.setCharacterEncoding("UTF-8");
        //find user
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
        //find call
        String callId = request.getParameter("id");
        if(Authentication.isNullOrEmpty(callId)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("call id not given", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }
        Call call = QueryHandler.getCall(callId);
        if(call == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("call not found", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }
        //read body
        BufferedReader reader = request.getReader();
        String line;
        StringBuilder body = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            body.append(line);
        }
        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(body.toString());
        } catch (JSONException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print(new ErrorResponse("not in json format", HttpServletResponse.SC_BAD_REQUEST));
            return;
        }
        //read new parameters
        try {
            call.setCity(jsonObject.getString("city"));
        } catch (JSONException ignored){}
        try {
            call.setProfession(jsonObject.getString("profession"));
        } catch (JSONException ignored){}
        try {
            call.setDescription(jsonObject.getString("description"));
        } catch (JSONException ignored){}
        try {
            call.setAddress(jsonObject.getString("address"));
        } catch (JSONException ignored){}
        try {
            call.setComment(jsonObject.getString("comment"));
        } catch (JSONException ignored){}
        try {
            call.setStatus(jsonObject.getString("status"));
        } catch (JSONException ignored){}
        try{
            call.setRate(Double.parseDouble(jsonObject.getString("rate")));
        }catch (NumberFormatException | JSONException ignored){}
        //update by user's permissions
        try {
            if((user.getType().equals(User.CUSTOMER))) {
                CallHandler.updateCall(call.getCallId().toString(), call.getCity(), call.getProfession(), call.getDescription(), call.getAddress(), user.getId().toString(), call.getStatus(), (float) call.getRate(), call.getComment());
                if (call.getStatus().equals(Call.CLOSE_CALL)) {
                    EmailSender emailSender = EmailSender.getInstance();
                    String msg = HI_MSG + user.getFirstName() + "," + DONE_MSG;
                    emailSender.send(user.getEmail(), DONE_SUBJECT, msg);
                }
            } else if(user.getType().equals(User.ADMIN)){
                CallHandler.updateCall(call.getCallId().toString(), call.getCity(), call.getProfession(), call.getDescription(), call.getAddress(), User.ADMIN, null, 0, null);
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

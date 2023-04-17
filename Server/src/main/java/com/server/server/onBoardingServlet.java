package com.server.server;

import com.google.gson.Gson;
import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.GoogleApiHandler;
import com.server.handlers.UserHandler;
import com.server.models.User;
import com.server.storage.StorageManager;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.SQLException;
import java.util.UUID;

@WebServlet(name = "onBoardingServlet", value = "/onBoarding")
public class onBoardingServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        String idToken = AuthorizationHandler.authorize(request);
        if(idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String email;
        try {
            email = GoogleApiHandler.getEmail(idToken);
        } catch (GeneralSecurityException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        try {
            if(StorageManager.isEmailExists(email)){
                response.getWriter().print("{\"message\":\"email already exists\"}");
                return;
            }
        } catch (SQLException e) {
            response.getWriter().print("{\"message\":\""+e.getMessage()+"\"}");
            return;
        }
        StringBuilder json = new StringBuilder();
        String temp;
        while ((temp = request.getReader().readLine())!= null)
            json.append(temp);
        long phoneNumber;
        String phoneNumberString = null;
        String address = null;
        String city = null;
        String profession = null;
        String id = null;
        String type = null;
        String firstName = null;
        String lastName = null;
        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(json.toString());
        }catch (JSONException e){
            response.getWriter().print("{\"message\":\"not in json format\"}");
            return;
        }
        String message = "";
        try {
            phoneNumberString = jsonObject.getString("phoneNumber");
            if(Authentication.isNullOrEmpty(phoneNumberString)){
                throw new JSONException("");
            }
        }catch (JSONException e){
            message += "missing: phone number";
        }
        try {
            address = jsonObject.getString("address");
            if(Authentication.isNullOrEmpty(address)){
                throw new JSONException("");
            }
        }catch (JSONException e){
            message +=  ((message.isEmpty()?"missing: ":", ") + "address");
        }
        try {
            city = jsonObject.getString("city");
            if(Authentication.isNullOrEmpty(city)){
                throw new JSONException("");
            }
        }catch (JSONException e){
            message +=  ((message.isEmpty()?"missing: ":", ") + "city");
        }
        if(StorageManager.getCities(city).equals("[]")){
            response.getWriter().print("{\"message\":\""+city+" not in the city my list\"}");
            return;
        }
        try {
            type = jsonObject.getString("type");
            if (Authentication.isNullOrEmpty(type)){
                throw new JSONException("");
            }
            if(!(type.equals("worker") || type.equals("admin") || type.equals("customer"))){
                response.getWriter().print("{\"message\":\"don't not know what is "+type+"\"}");
                return;
            }else{
                if(type.equals("worker")){
                    try {
                        profession = jsonObject.getString("profession");
                        if(Authentication.isNullOrEmpty(profession)){
                            throw new JSONException("");
                        }
                    }catch (JSONException e){
                        message += ((message.isEmpty()?"missing: ":", ") + "profession");
                    }
                }
            }
        }catch (JSONException e){
            message += ((message.isEmpty()?"missing: ":", ") + "type");
        }
        try {
            lastName = jsonObject.getString("lastName");
            if(Authentication.isNullOrEmpty(lastName)){
                throw new JSONException("");
            }
        }catch (JSONException e){
            message += ((message.isEmpty()?"missing: ":", ") + "lastName");
        }
        try {
            firstName = jsonObject.getString("firstName");
            if(Authentication.isNullOrEmpty(firstName)){
                throw new JSONException("");
            }
        }catch (JSONException e){
            message += ((message.isEmpty()?"missing: ":", ") + "firstName");
        }

        if(!Authentication.isNullOrEmpty(message)){
            response.getWriter().print("{\"message\":\"" + message + "\"}");
            return;
        }

        try{
            phoneNumber = Long.parseLong(phoneNumberString);
        }catch (NumberFormatException e){
            response.getWriter().print("{\"message\":\"phone is not a number\"}");
            return;
        }
        id = UUID.randomUUID().toString();
        if(StorageManager.addUser(email, firstName, lastName, phoneNumber, address, city, id, type)){
            if(type.equals("worker")){
                if (StorageManager.addWorkerProfession(id, profession)) {
                    response.getWriter().print("{\"message\":\"succeed\"}");
                }else{
                    response.getWriter().print("{\"message\":\"cannot add profession by unknown resent\"}");
                }
            }else{
                response.getWriter().print("{\"message\":\"succeed\"}");
            }
            return;
        }
        response.getWriter().print("{\"message\":\"failed by unknown resent\"}");
    }
}

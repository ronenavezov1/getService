package com.server.server;

import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.storage.StorageManager;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "onBoardingServlet", value = "/onBoarding")
public class onBoardingServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        request.setCharacterEncoding("UTF-8");

/*        String idToken = AuthorizationHandler.authorize(request);
        if(idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }*/

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
        try {
            id = jsonObject.getString("id");
            if(Authentication.isNullOrEmpty(id)){
                throw new JSONException("");
            }
        }catch (JSONException e){
            message +=  ((message.isEmpty()?"missing: ":", ") + "id");
        }
        try {
            type = jsonObject.getString("type");
            if(Authentication.isNullOrEmpty(type)){
                throw new JSONException("");
            }
        }catch (JSONException e){
            message += ((message.isEmpty()?"missing: ":", ") + "type");
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

        if(StorageManager.updateUser(phoneNumber, address, city, id, type)){
            if(type.equals("worker")) {
                try {
                    profession = jsonObject.getString("profession");
                    if (Authentication.isNullOrEmpty(profession)) {
                        throw new JSONException("");
                    }
                    if (StorageManager.updateWorkerProfession(id, profession)) {
                        response.getWriter().print("{\"message\":\"succeed\"}");
                        return;
                    }
                } catch (JSONException e) {
                    response.getWriter().print("{\"message\":\"missing profession\"}");
                    return;
                }
            } else if (type.equals("customer") || type.equals("admin")) {
                response.getWriter().print("{\"message\":\"succeed\"}");
                return;
            }
        }
        response.getWriter().print("{\"message\":\"failed from unknown resent\"}");
    }
}

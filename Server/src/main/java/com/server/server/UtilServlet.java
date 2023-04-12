package com.server.server;

import com.server.handlers.Authentication;
import com.server.handlers.AuthorizationHandler;
import com.server.handlers.GoogleApiHandler;
import com.server.handlers.UserHandler;
import com.server.models.User;
import com.server.storage.StorageManager;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "UtilServlet", value = "/util/*")
public class UtilServlet extends HttpServlet {

    private String cityJson = "";

    @Override
    public void init() throws ServletException {
        super.init();
        cityJson = StorageManager.getCities("");
    }

    /** /util/getCities?startWith={string @optional}*/
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String requestURI = request.getRequestURI();
        if (requestURI == null || requestURI.isEmpty())
            return;
        int lastIndexOfForwardSlash = requestURI.lastIndexOf('/');
        if (lastIndexOfForwardSlash == -1)
            return;
        String action = requestURI.substring(lastIndexOfForwardSlash + 1);
        if (action.isEmpty())
            return;
        switch (action) {
            case "getCities":
                getCities(request, response);
                break;
            default:
                return;
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String requestURI = request.getRequestURI();
        if (requestURI == null || requestURI.isEmpty())
            return;
        int lastIndexOfForwardSlash = requestURI.lastIndexOf('/');
        if (lastIndexOfForwardSlash == -1)
            return;
        String action = requestURI.substring(lastIndexOfForwardSlash + 1);
        if (action.isEmpty())
            return;
        switch (action) {
            case "onBoarding":
                onBoarding(request, response);
                break;
            default:
                return;
        }
    }

    private void getCities(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        String startWith = request.getParameter("startWith");
        if(Authentication.isNullOrEmpty(startWith))
            response.getWriter().print(cityJson);
        else
            response.getWriter().print(StorageManager.getCities(startWith));
    }

    //todo: million checks
    private void onBoarding(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idToken = AuthorizationHandler.authorize(request);
        if(idToken == null){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        StringBuilder body = new StringBuilder();
        byte[] buffer = new byte[2048];
        int read;
        while ((read = request.getInputStream().read()) != -1)
            body.append(new String(buffer, 0, read));

        long phoneNumber;
        String phoneNumberString;
        String address;
        String city;
        String profession;
        String id;
        try {
            JSONObject jsonObject = new JSONObject(body.toString());
            phoneNumberString = jsonObject.getString("phoneNumber");
            address = jsonObject.getString("address");
            city = jsonObject.getString("city");
            id = jsonObject.getString("id");
        }catch (JSONException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if(Authentication.isNullOrEmpty(phoneNumberString, address, city, id)){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try{
            phoneNumber = Long.parseLong(phoneNumberString);
        }catch (NumberFormatException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if(StorageManager.updateUser(phoneNumber, address, city, id)){
            //todo: if worker add profession
        }
        response.getWriter().print("true");
    }

    @Override
    public void destroy() {
    }
}


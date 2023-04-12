package com.server.server;

import com.server.handlers.Authentication;
import com.server.storage.StorageManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "getCitiesServlet", value = "/cities")
public class getCitiesServlet extends HttpServlet {

    private String cityJson = "";

    @Override
    public void init() throws ServletException {
        super.init();
        cityJson = StorageManager.getCities("");
    }

    /** ?startWith={string @optional}*/
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        String startWith = request.getParameter("startWith");
        if(Authentication.isNullOrEmpty(startWith))
            response.getWriter().print(cityJson);
        else
            response.getWriter().print(StorageManager.getCities(startWith));
    }
}


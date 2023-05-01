package com.server.server;

import com.server.handlers.Authentication;
import com.server.storage.QueryHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "getCitiesServlet", value = "/cities", loadOnStartup = 1)
public class getCitiesServlet extends HttpServlet {

    private String cityJson = "";

    @Override
    public void init() throws ServletException {
        super.init();
        cityJson = QueryHandler.getCities("").toString();
    }

    /** ?startWith={string @optional}*/
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        String startWith = request.getParameter("startWith");
        if(Authentication.isNullOrEmpty(startWith))
            response.getWriter().print(cityJson);
        else
            response.getWriter().print(QueryHandler.getCities(startWith).toString());
    }
}


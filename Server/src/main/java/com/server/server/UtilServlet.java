package com.server.server;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

@WebServlet(name = "UtilServlet", value = "/util/*")
public class UtilServlet extends HttpServlet {

    private String cityJson = "";

    @Override
    public void init() throws ServletException {
        super.init();
        cityJson = DataBase.getCities("");
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

    private void getCities(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        String startWith = request.getParameter("startWith");
        if(Authentication.isNullOrEmpty(startWith))
            response.getWriter().print(cityJson);
        else
            response.getWriter().print(DataBase.getCities(startWith));
    }

    @Override
    public void destroy() {
    }
}


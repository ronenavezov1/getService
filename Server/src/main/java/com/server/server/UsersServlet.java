package com.server.server;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

@WebServlet(name = "UsersServlet", value = "/user/*")
public class UsersServlet extends HttpServlet {

    @Override
    public void init() throws ServletException {
        super.init();
/*        File file = new File("C:\\Users\\ronia\\Downloads\\IL\\IL.txt");
        File dest = new File("C:\\Users\\ronia\\Downloads\\IL\\IL2.txt");
        try(FileInputStream fileInputStream = new FileInputStream(file)){
                try (Reader reader = new InputStreamReader(fileInputStream, StandardCharsets.UTF_8);) {
                    try (BufferedReader bufferedReader = new BufferedReader(reader)) {
                        try(OutputStream outputStream = new FileOutputStream(dest)) {
                            try (Writer writer = new UTF8OutputStreamWriter(outputStream)) {

                            }
                        }
                    }
                }

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }*/
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String requestURI = request.getRequestURI();
        if (Authentication.isNullOrEmpty(requestURI))
            return;
        int lastIndexOfForwardSlash = requestURI.lastIndexOf('/');
        if (lastIndexOfForwardSlash == -1)
            return;
        String action = requestURI.substring(lastIndexOfForwardSlash + 1);
        if (action.isEmpty())
            return;
        switch (action) {
            case "test":
                test123(request, response);
                break;
            default:
                return;
        }
    }

    private void test123(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().print(DataBase.test());
    }

    public void destroy() {
    }
}
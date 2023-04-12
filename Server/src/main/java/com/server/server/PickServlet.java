package com.server.server;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

@WebServlet(name = "WorkerServlet", value = "/pick")
public class PickServlet extends HttpServlet {
}

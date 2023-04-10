package com.server.storage;

public class Queries {

    // USER QUERIES
    public static final String SELECT_USER_BY_EMAIL = "SELECT * FROM public.user WHERE \"user\".email = ?";
    public static final String INSERT_USER          = "INSERT INTO public.user (email, first_name, last_name) VALUES (?, ?, ?)";


    // WORKER QUERIES
    public static final String SELECT_WORKER_BY_EMAIL = "SELECT * FROM worker WHERE email = ?";
    public static final String INSERT_WORKER          = "INSERT INTO worker (email, first_name, last_name) VALUES (?, ?, ?)";

}

package com.server.storage;

public class Queries {

    // USER QUERIES
    public static final String SELECT_USER_BY_EMAIL = "SELECT * FROM public.user WHERE \"user\".email = ?";
    public static final String INSERT_USER          = "INSERT INTO public.user (user_id, email, first_name, last_name, address, city, phone, type, is_approved, is_onboarding_completed) " +
            "VALUES (?::uuid, ?, ?, ?, ?, ?, ?, ?, ?, true)";
    public static final String UPDATE_USER          = "UPDATE public.user SET email = ?, first_name = ?, last_name = ?, address = ?, city = ?, phone = ?, type = ?, is_onboarding_completed = true " +
            "WHERE user_id = ?::uuid";

    // WORKER QUERIES
    public static final String INSERT_WORKER        = "INSERT INTO public.worker VALUES (?::uuid,?)";
    public static final String UPDATE_WORKER        = "UPDATE public.worker SET profession = ? WHERE worker_id = ?::uuid";

    //  CITY QUERIES
    public static final String SELECT_CITY          = "SELECT name FROM public.city WHERE starts_with(public.city.name, ?) ORDER BY name ASC";
    public static final String INSERT_CITY          = "INSERT INTO into public.city VALUES (?)";
}

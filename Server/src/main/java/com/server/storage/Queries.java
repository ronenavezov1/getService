package com.server.storage;

public class Queries {

    // CALL QUERIES
    public static final String GET_CALL = "SELECT call_id, user_id, service, description, address, city\n" +
            "\tFROM public.call" +
            "\tWHERE public.call.call_id = ?::uuid;";
    public static final String UPDATE_CALL = "UPDATE public.call\n" +
            "\tSET service=?, description=?, address=?, city=?\n" +
            "\tWHERE call_id=?::uuid;";

    public static final String UPDATE_PICK_CALL = "UPDATE public.call " +
            "SET worker_id=?::uuid, status=?, expected_arrival=? " +
            "WHERE call_id=?::uuid;";
    public static final String DELETE_CALL = "DELETE FROM public.call\n" +
            "\tWHERE call_id = ?::uuid and (user_id = ?::uuid or ?) ;";
    public static final String GET_CALLS = "SELECT call_id, user_id, worker_id, service, description, comment, status, rate, address, city, creation_time, expected_arrival\n" +
            "FROM public.call\n" +
            "WHERE starts_with(call_id::varchar, ?) and starts_with(user_id::varchar,?) and (worker_id is NULL or starts_with(worker_id::varchar, ?)) and starts_with(public.call.city, ?) and starts_with( public.call.status, ?);";
    public static final String CREATE_CALL = "INSERT INTO public.call(\n" +
            "\tcall_id, user_id, service, description, comment, status, address, city, creation_time)\n" +
            "\tVALUES (?::uuid,?::uuid,?,?,?,?,?,?,?);";

    // USER QUERIES
    public static final String SELECT_USER_BY_EMAIL = "SELECT * FROM public.user WHERE \"user\".email = ?";
    public static final String SELECT_USER_BY_UUID = "SELECT * FROM public.user WHERE \"user\".user_id = ?::uuid";
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

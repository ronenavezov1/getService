package com.server.handlers;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.server.exceptions.InvalidCallException;
import com.server.models.Call;
import com.server.storage.QueryHandler;

import java.util.UUID;

public class CallHandler {
    public static void creatCall(String body) throws InvalidCallException {
        Call call;
        Gson gson = new Gson();
        call = gson.fromJson(body, Call.class);
        JsonArray missing = new JsonArray();
        boolean ifMissing = false;
        if(call.getCustomerId() == null){
            ifMissing = true;
            missing.add("missing customer id");
        }
        if(Authentication.isNullOrEmpty(call.getAddress())){
            ifMissing = true;
            missing.add("missing address");
        }
        if(Authentication.isNullOrEmpty(call.getTitle())){
            ifMissing = true;
            missing.add("missing title");
        }
        if(Authentication.isNullOrEmpty(call.getCity())){
            ifMissing = true;
            missing.add("missing city");
        }
        if(Authentication.isNullOrEmpty(call.getDescription())){
            ifMissing = true;
            missing.add("missing description");
        }
        if(Authentication.isNullOrEmpty(call.getService())){
            ifMissing = true;
            missing.add("missing service");
        }
        if(ifMissing)
            throw new InvalidCallException(missing.toString());
        call.setCallId(UUID.randomUUID());
        call.setCreationTime(System.currentTimeMillis());
        call.setStatus(Call.OPEN_CALL);
        call.setWorkerId(null);
        QueryHandler.createCall(call);
    }
}

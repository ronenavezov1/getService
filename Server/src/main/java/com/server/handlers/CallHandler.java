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
        if(Authentication.isNullOrEmpty(call.getCity())){
            ifMissing = true;
            missing.add("missing city");
        }else if(!Authentication.isCityExist(call.getCity())){
            ifMissing = true;
            missing.add("I dont know what and where is " + call.getCity());
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
        if(!QueryHandler.createCall(call))
            throw new InvalidCallException("oops something goes wrong");
    }

    public static boolean updateCall(String callId, String city, String service, String description, String address) {
        Call updatedCall = QueryHandler.getCall(callId);
        if(updatedCall == null)
            return false;
        if(!Authentication.isNullOrEmpty(city))
            updatedCall.setCity(city);
        if(!Authentication.isNullOrEmpty(service))
            updatedCall.setService(service);
        if(!Authentication.isNullOrEmpty(description))
            updatedCall.setDescription(description);
        if(!Authentication.isNullOrEmpty(address))
            updatedCall.setAddress(address);
        return QueryHandler.updateCall(updatedCall);
    }
}

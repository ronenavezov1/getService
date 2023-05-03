package com.server.handlers;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.server.exceptions.InvalidCallException;
import com.server.models.Call;
import com.server.models.User;
import com.server.storage.QueryHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CallHandler {
    public static void creatCall(String body) throws InvalidCallException {
        Call call;
        Gson gson = new Gson();
        call = gson.fromJson(body, Call.class);
        List<String> missing = new ArrayList<>();
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
        if(ifMissing) {
            StringBuilder msg = new StringBuilder();
            for (int i = 0; i < missing.size(); i++) {
                msg.append(missing.get(i)).append(i<missing.size()-1?"\n ":"");
            }
            throw new InvalidCallException(msg.toString());
        }
        call.setCallId(UUID.randomUUID());
        call.setCreationTime(System.currentTimeMillis());
        call.setStatus(Call.OPEN_CALL);
        call.setWorkerId(null);
        if(!QueryHandler.createCall(call))
            throw new InvalidCallException("oops something goes wrong");
    }

    public static void updateCall(String callId, String city, String service, String description, String address, String userId) throws InvalidCallException{
        Call updatedCall = QueryHandler.getCall(callId);
        if(updatedCall == null)
            throw new InvalidCallException("call not exist");
        else if (updatedCall.getCustomerId() == null || (!updatedCall.getCustomerId().toString().equals(userId) && !userId.equals(User.ADMIN))) {
            throw new InvalidCallException("you not allow to edit this call");
        }
        if(!Authentication.isNullOrEmpty(city))
            updatedCall.setCity(city);
        if(!Authentication.isNullOrEmpty(service))
            updatedCall.setService(service);
        if(!Authentication.isNullOrEmpty(description))
            updatedCall.setDescription(description);
        if(!Authentication.isNullOrEmpty(address))
            updatedCall.setAddress(address);
        if(!QueryHandler.updateCall(updatedCall))
            throw new InvalidCallException("oops something goes wrong");
    }
}

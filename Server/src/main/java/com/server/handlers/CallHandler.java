package com.server.handlers;

import com.google.common.base.Strings;
import com.server.exceptions.InvalidCallException;
import com.server.models.Call;
import com.server.models.User;
import com.server.storage.QueryHandler;
import org.json.JSONObject;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class CallHandler {
    public static String getCalls(User user, String callId, String status, String city, String customerId, String workerId){
        String responseString = null;
        if(status.equals(Call.OPEN_CALL) && user.getType().equals(User.WORKER)){//public calls
            responseString = QueryHandler.getCalls(callId, customerId, workerId, Call.OPEN_CALL, city, user.getId().toString());
        } else {//private calls
            switch (user.getType()) {
                case User.WORKER:
                    responseString = QueryHandler.getCalls(callId, customerId, user.getId().toString(), status, city, user.getId().toString());
                    break;
                case User.CUSTOMER:
                    responseString = QueryHandler.getCalls(callId, user.getId().toString(), workerId, status, city, "all");
                    break;
                case User.ADMIN:
                    responseString = QueryHandler.getCalls(callId, customerId, workerId, status, city, "all");
                    break;
            }
        }
        return responseString;
    }
    public static void creatCall(Call call) throws InvalidCallException {

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
        if(Authentication.isNullOrEmpty(call.getProfession())){
            ifMissing = true;
            missing.add("missing profession");
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

    public static void updateCall(String callId, String city, String profession, String description, String address, String userId, String status, float rate, String comment) throws InvalidCallException{
        Call updatedCall = QueryHandler.getCall(callId);
        if(updatedCall == null)
            throw new InvalidCallException("call not exist");
        else if (updatedCall.getCustomerId() == null || (!updatedCall.getCustomerId().toString().equals(userId) && !userId.equals(User.ADMIN))) {
            throw new InvalidCallException("you not allow to edit this call");
        }
        if(!Authentication.isNullOrEmpty(city))
            updatedCall.setCity(city);
        if(!Authentication.isNullOrEmpty(profession))
            updatedCall.setProfession(profession);
        if(!Authentication.isNullOrEmpty(description))
            updatedCall.setDescription(description);
        if(!Authentication.isNullOrEmpty(address))
            updatedCall.setAddress(address);
        if(!Authentication.isNullOrEmpty(status) && status.equals(Call.CLOSE_CALL)) {
            updatedCall.setStatus(Call.CLOSE_CALL);
            updatedCall.setComment(comment);
            if((rate < 1 || rate > 5) && rate != 0)
                throw new InvalidCallException("rate must be: 1 <= rate <= 5");
            updatedCall.setRate(rate);
        }
        try{
            QueryHandler.updateCall(updatedCall);
        }catch (SQLException e){
            throw new InvalidCallException(e.getMessage());
        }
    }

    public static void pickCall(String callId, String body) throws Exception {
        String workerId;
        String status;
        Date expectedArrival = null;
        try {
            JSONObject jsonObject = new JSONObject(body);
            workerId = jsonObject.getString("workerId");
            status = jsonObject.getString("status");
            String expectedArrivalString = jsonObject.getString("expectedArrivalTime");
            if (!Strings.isNullOrEmpty(expectedArrivalString)) {
                expectedArrival = Call.SIMPLE_DATE_FORMAT.parse(expectedArrivalString);
            }
            boolean success = QueryHandler.updatePickCall(callId, workerId, status, expectedArrival);

            if (!success) {
                throw new Exception("call id '" + callId + "' does not exist");
            }
        } catch (Exception e) {
            throw new Exception("Failed to pick call: " + e.getMessage());
        }
    }
}

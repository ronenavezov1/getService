package com.server.models;

import java.text.SimpleDateFormat;
import java.util.UUID;

public class Call {
    public static final SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy:hh:mm");
    public static final String OPEN_CALL = "new";
    public static final String CLOSE_CALL = "done";
    public static final String RECEIVED_CALL = "inProgress";
    private UUID callId;
    private UUID customerId;
    private UUID workerId;
    private String service;
    private String description;
    private String comment;
    private String status;
    private double rate;
    private String address;
    private String city;
    private long creationTime;
    private long expectedArrival;

    public Call(UUID callId, UUID customerId, String service, String description, String address, String city) {
        this.callId = callId;
        this.customerId = customerId;
        this.service = service;
        this.description = description;
        this.address = address;
        this.city = city;
        this.creationTime = System.currentTimeMillis();
        this.status = OPEN_CALL;
    }

    public UUID getCallId() {
        return callId;
    }

    public void setCallId(UUID callId) {
        this.callId = callId;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public UUID getWorkerId() {
        return workerId;
    }

    public void setWorkerId(UUID workerId) {
        this.workerId = workerId;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public long getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(long creationTime) {
        this.creationTime = creationTime;
    }

    public long getExpectedArrival() {
        return expectedArrival;
    }

    public void setExpectedArrival(long expectedArrival) {
        this.expectedArrival = expectedArrival;
    }
}

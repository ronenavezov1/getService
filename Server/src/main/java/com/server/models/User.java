package com.server.models;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.UUID;

public class User {
    public static final String CUSTOMER = "customer";
    public static final String WORKER = "worker";
    public static final String ADMIN = "admin";
    protected UUID id;
    protected String email;
    protected String firstName;
    protected String lastName;
    protected String address;
    protected String city;
    protected long phoneNumber;
    protected String type;
    protected boolean isApproved = false;
    protected boolean isOnBoardingCompleted = false;

    public User() {
        id = UUID.randomUUID();
    }

    public User(UUID id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public User(UUID id, String email, String firstName, String lastName, String address, String city, long phoneNumber, String type, boolean isApproved, boolean isOnBoardingCompleted) {
        this(id, email, firstName, lastName);
        this.address = address;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.isApproved = isApproved;
        this.isOnBoardingCompleted = isOnBoardingCompleted;
    }

    @Override
    public String toString() {
        Gson gson = new GsonBuilder().serializeNulls().create();
        return gson.toJson(this);
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isApproved() {
        return isApproved;
    }

    public void setApproved(boolean approved) {
        isApproved = approved;
    }

    public boolean isOnBoardingCompleted() {
        return isOnBoardingCompleted;
    }

    public void setOnBoardingCompleted(boolean onBoardingCompleted) {
        isOnBoardingCompleted = onBoardingCompleted;
    }
}

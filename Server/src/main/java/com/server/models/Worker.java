package com.server.models;

import java.util.UUID;

public class Worker extends User {

    private String profession;

    public Worker() {
        super();
    }

    public Worker(UUID id, String email, String firstName, String lastName) {
        super(id, email, firstName, lastName);
    }

    public Worker(UUID id, String email, String firstName, String lastName, String address, String city, long phoneNumber, String type, boolean isApproved, boolean isOnBoardingCompleted, String profession) {
        super(id, email, firstName, lastName, address, city, phoneNumber, type, isApproved, isOnBoardingCompleted);
        this.profession = profession;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }
}

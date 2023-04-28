package com.server.models;

import java.util.UUID;

public class Admin extends User {

    public Admin() {
        id = UUID.randomUUID();
    }

    public Admin(UUID id, String email, String firstName, String lastName, String address, String city, long phoneNumber, boolean isApproved, boolean isOnBoardingCompleted) {
        super(id, email, firstName, lastName, address, city, phoneNumber, "admin", isApproved, isOnBoardingCompleted);
    }
}

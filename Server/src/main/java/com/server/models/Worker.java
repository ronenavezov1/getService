package com.server.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class Worker extends User {

    private List<String> profession;

    public Worker() {
        super();
    }

    public Worker(UUID id, String email, String firstName, String lastName) {
        super(id, email, firstName, lastName);
    }
    public Worker(UUID id, String email, String firstName, String lastName, String address, String city, long phoneNumber, String type, boolean isApproved,
                  boolean isOnBoardingCompleted, List<String> profession) {
        super(id, email, firstName, lastName, address, city, phoneNumber, type, isApproved, isOnBoardingCompleted);
        this.profession = profession;
    }

    public Worker(UUID id, String email, String firstName, String lastName, String address, String city, long phoneNumber, String type, boolean isApproved, boolean isOnBoardingCompleted,
                  String[] profession) {
        this(id, email, firstName, lastName, address, city, phoneNumber, type, isApproved, isOnBoardingCompleted, new ArrayList<>(Arrays.asList(profession)));
    }

    public List<String> getProfession() {
        return profession;
    }
    public void addProfession(String profession){
        this.profession.add(profession);
    }

    public void setProfession(String[] profession) {
        this.profession = new ArrayList<>(Arrays.asList(profession));
    }
}

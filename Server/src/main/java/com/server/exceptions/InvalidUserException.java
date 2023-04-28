package com.server.exceptions;

public class InvalidUserException extends Exception{
    public InvalidUserException(){
        super();
    }
    public InvalidUserException(String e){
        super(e);
    }
}

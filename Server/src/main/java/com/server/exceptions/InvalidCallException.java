package com.server.exceptions;

public class InvalidCallException extends Exception {
    public InvalidCallException() {
        super();
    }

    public InvalidCallException(String e) {
        super(e);
    }
}

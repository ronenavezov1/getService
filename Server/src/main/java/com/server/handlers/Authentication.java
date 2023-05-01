package com.server.handlers;

import com.server.storage.QueryHandler;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class Authentication {
    private static final List<String> cities = generatCitiesList();
    private static final String senderUsername = "ronigeogenie@gmail.com";
    private static final String senderPassword = "";
    private static List<String> generatCitiesList(){
        Iterator<Object> iterator = QueryHandler.getCities("").iterator();
        List<String> cities = new ArrayList<String>();
        while (iterator.hasNext()){
            JSONObject next = (JSONObject) (iterator.next());
            cities.add((String) next.get("name"));
        }
        return cities;
    }
    public static boolean isCityExist(String city){
        return cities.contains(city);
    }
    public static boolean isNullOrEmpty(String... strings){
        for (String string : strings) {
            if (string == null || string.isEmpty())
                return true;
        }
        return false;
    }
    public static void sendEmailViaGoogle(String email, String msg){

        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true"); //TLS

        Session session = Session.getInstance(prop,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(senderUsername, senderPassword);
                    }
                });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderUsername));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(email)
            );
            message.setSubject("Do not replay");
            message.setText(msg);

            Transport.send(message);


        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}

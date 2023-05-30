package com.server;
import com.server.config.Configuration;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailSender {

    private static Configuration configuration = Configuration.getInstance();
    private static EmailSender emailSender = null;
    private static Properties prop;

    private EmailSender() {
        init();
    }

    public static synchronized EmailSender getInstance() {
        if (emailSender == null)
            emailSender = new EmailSender();
        return emailSender;
    }

    private void init() {
        prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true"); //TLS
    }

    public void send(String to, String subject, String msg) {

        Session session = Session.getInstance(prop,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(configuration.getEmailUserName(), configuration.getEmailPassword());
                    }
                });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(configuration.getEmailUserName()));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(to)
            );
            message.setSubject(subject);
            message.setText(msg);

            Transport.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
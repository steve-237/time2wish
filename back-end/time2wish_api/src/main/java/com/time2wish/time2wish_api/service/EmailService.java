package com.time2wish.time2wish_api.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String email, String token) {
        String resetLink = "http://localhost:4200/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Réinitialisation de votre mot de passe - Time2Wish");
        message.setText("Cliquez sur ce lien pour réinitialiser votre mot de passe : " + resetLink);

        mailSender.send(message);
    }
}
package com.time2wish.time2wish_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @PostConstruct
    public void check() {
        if (mailSender == null) {
            System.err.println("ERREUR CRITIQUE : JavaMailSender n'a pas été injecté !");
        }
    }

    public void sendResetPasswordEmail(String email, String token) {
        String resetLink = "http://localhost:4200/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Réinitialisation de votre mot de passe - Time2Wish");
        message.setText("Cliquez sur ce lien pour réinitialiser votre mot de passe : " + resetLink);

        try {
            mailSender.send(message);
            System.out.println("Email envoyé avec succès à : " + email);
        } catch (MailException e) {
            // Ici on capture l'erreur et on affiche l'email + l'erreur
            System.err.println("ERREUR lors de l'envoi à l'adresse : " + email);
            System.err.println("Détail de l'erreur : " + e.getMessage());
            System.out.println("Échec de l'envoi de l'email à " + email + " : " + e.getMessage());

            // Optionnel : tu peux relancer une exception si tu veux que ton
            // contrôleur prévienne l'utilisateur que l'envoi a échoué
            throw new RuntimeException("Échec de l'envoi de l'email à " + email + " : " + e.getMessage());
        }
    }
}
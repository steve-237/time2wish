package com.time2wish.time2wish_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class EmailService {
//TODO: Fix the error occuring while sending and email

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

        // 1. Créer un message MIME (pour le HTML)
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            // 2. Utiliser le Helper pour construire le contenu
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            // Contenu HTML avec une balise <a> pour le lien
            String htmlContent = "<h3>Réinitialisation de votre mot de passe</h3>" +
                    "<p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>" +
                    "<a href=\"" + resetLink + "\" style=\"background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;\">" +
                    "Réinitialiser mon mot de passe</a>" +
                    "<p>Si le bouton ne fonctionne pas, copiez ce lien : <br>" + resetLink + "</p>";

            helper.setTo(email);
            helper.setSubject("Réinitialisation de votre mot de passe - Time2Wish");
            helper.setText(htmlContent, true); // Le 'true' ici indique que c'est du HTML

            // 3. Envoyer
            mailSender.send(mimeMessage);
            System.out.println("Email HTML envoyé avec succès à : " + email);

        } catch (MessagingException | MailException e) {
            System.err.println("ERREUR lors de l'envoi à : " + email);
            System.err.println("Détail : " + e.getMessage());
            throw new RuntimeException("Échec de l'envoi de l'email : " + e.getMessage());
        }
    }
}
package api.point_interet.api_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import api.point_interet.api_service.model.notification.NotificationType;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender emailSender;
    private final String twilioAccountSid;
    private final String twilioAuthToken;
    private final String twilioPhoneNumber;

    public NotificationService(
            JavaMailSender emailSender,
            @Value("${twilio.account-sid}") String twilioAccountSid,
            @Value("${twilio.auth-token}") String twilioAuthToken,
            @Value("${twilio.phone-number}") String twilioPhoneNumber) {
        this.emailSender = emailSender;
        this.twilioAccountSid = twilioAccountSid;
        this.twilioAuthToken = twilioAuthToken;
        this.twilioPhoneNumber = twilioPhoneNumber;
    }

    public void envoyerNotificationEmail(String destinataire, String sujet, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(destinataire);
        mailMessage.setSubject(sujet);
        mailMessage.setText(message);
        emailSender.send(mailMessage);
    }

    public void envoyerNotificationSMS(String numeroTelephone, String message) {
        // TODO: Implémenter l'envoi de SMS via Twilio
        // Twilio.init(twilioAccountSid, twilioAuthToken);
        // Message.creator(
        //     new PhoneNumber(numeroTelephone),
        //     new PhoneNumber(twilioPhoneNumber),
        //     message
        // ).create();
    }

    public void notifierClient(String clientId, String message) {
        // Par défaut, on envoie une notification par email
        notifierClient(clientId, message, NotificationType.EMAIL);
    }

    public void notifierClient(String clientId, String message, NotificationType type) {
        switch (type) {
            case EMAIL:
                envoyerEmail(clientId, message);
                break;
            case SMS:
                envoyerSMS(clientId, message);
                break;
            default:
                logger.warn("Type de notification non supporté : {}", type);
        }
    }

    private void envoyerEmail(String clientId, String message) {
        // TODO: Implémenter l'envoi d'email
        logger.info("Email envoyé à {} : {}", clientId, message);
    }

    private void envoyerSMS(String clientId, String message) {
        // TODO: Implémenter l'envoi de SMS
        logger.info("SMS envoyé à {} : {}", clientId, message);
    }
} 

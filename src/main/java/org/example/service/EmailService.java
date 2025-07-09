package org.example.service;

import org.example.entity.Goal;
import org.example.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    private final NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

    public void sendGoalCompletedEmail(User user, Goal goal) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Meta Financeira Concluída");
        message.setText(buildGoalCompletedMessage(user, goal));

        try {
            mailSender.send(message);
            logger.info("Email de meta concluída enviado para: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Erro ao enviar email para {}: {}", user.getEmail(), e.getMessage());
        }
    }

    public void sendGoalOverdueEmail(User user, Goal goal) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Meta Financeira Vencida");
        message.setText(buildGoalOverdueMessage(user, goal));

        try {
            mailSender.send(message);
            logger.info("Email de meta vencida enviado para: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Erro ao enviar email para {}: {}", user.getEmail(), e.getMessage());
        }
    }

    public void sendGoalProgressEmail(User user, Goal goal, int progressPercentage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Progresso da Meta: " + progressPercentage + "%");
        message.setText(buildGoalProgressMessage(user, goal, progressPercentage));

        try {
            mailSender.send(message);
            logger.info("Email de progresso enviado para: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Erro ao enviar email para {}: {}", user.getEmail(), e.getMessage());
        }
    }

    public void sendBudgetExceededEmail(User user, String categoryName, BigDecimal limit, BigDecimal current) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Orçamento Excedido - " + categoryName);
        message.setText(buildBudgetExceededMessage(user, categoryName, limit, current));

        try {
            mailSender.send(message);
            logger.info("Email de orçamento excedido enviado para: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Erro ao enviar email para {}: {}", user.getEmail(), e.getMessage());
        }
    }

    private String buildGoalCompletedMessage(User user, Goal goal) {
        return String.format(
            "Olá %s,\n\n" +
            "Parabéns! Você concluiu sua meta financeira:\n\n" +
            "Meta: %s\n" +
            "Valor: %s\n" +
            "Concluída em: %s\n\n" +
            "Continue assim e alcance seus objetivos financeiros!\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Financeira",
            user.getFullName(),
            goal.getName(),
            currencyFormatter.format(goal.getTargetAmount()),
            goal.getCompletedAt().toLocalDate()
        );
    }

    private String buildGoalOverdueMessage(User user, Goal goal) {
        return String.format(
            "Olá %s,\n\n" +
            "Sua meta financeira está vencida:\n\n" +
            "Meta: %s\n" +
            "Valor alvo: %s\n" +
            "Valor atual: %s\n" +
            "Data limite: %s\n\n" +
            "Revise sua meta e continue trabalhando em seus objetivos financeiros!\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Financeira",
            user.getFullName(),
            goal.getName(),
            currencyFormatter.format(goal.getTargetAmount()),
            currencyFormatter.format(goal.getCurrentAmount()),
            goal.getTargetDate().toLocalDate()
        );
    }

    private String buildGoalProgressMessage(User user, Goal goal, int progressPercentage) {
        return String.format(
            "Olá %s,\n\n" +
            "Você está fazendo um ótimo progresso em sua meta:\n\n" +
            "Meta: %s\n" +
            "Progresso: %d%%\n" +
            "Valor atual: %s\n" +
            "Valor alvo: %s\n" +
            "Restante: %s\n\n" +
            "Continue assim!\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Financeira",
            user.getFullName(),
            goal.getName(),
            progressPercentage,
            currencyFormatter.format(goal.getCurrentAmount()),
            currencyFormatter.format(goal.getTargetAmount()),
            currencyFormatter.format(goal.getRemainingAmount())
        );
    }

    private String buildBudgetExceededMessage(User user, String categoryName, BigDecimal limit, BigDecimal current) {
        return String.format(
            "Olá %s,\n\n" +
            "Você excedeu o orçamento da categoria:\n\n" +
            "Categoria: %s\n" +
            "Limite: %s\n" +
            "Gasto atual: %s\n" +
            "Excesso: %s\n\n" +
            "Revise seus gastos para manter o controle financeiro!\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Financeira",
            user.getFullName(),
            categoryName,
            currencyFormatter.format(limit),
            currencyFormatter.format(current),
            currencyFormatter.format(current.subtract(limit))
        );
    }
}

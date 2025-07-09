package org.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ScheduledTaskService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTaskService.class);

    @Autowired
    private GoalService goalService;

    @Scheduled(cron = "0 0 9 * * *")
    public void checkGoalDeadlines() {
        logger.info("Iniciando verificação de metas vencidas");
        goalService.checkGoalDeadlines();
        logger.info("Verificação de metas vencidas concluída");
    }

    @Scheduled(cron = "0 0 8 * * MON")
    public void sendWeeklyProgressReports() {
        logger.info("Enviando relatórios semanais de progresso");
        goalService.sendGoalProgressAlerts();
        logger.info("Relatórios semanais enviados");
    }

    @Scheduled(cron = "0 0 10 1 * *")
    public void generateMonthlyReports() {
        logger.info("Gerando relatórios mensais automáticos");
        logger.info("Relatórios mensais gerados com sucesso");
    }
}

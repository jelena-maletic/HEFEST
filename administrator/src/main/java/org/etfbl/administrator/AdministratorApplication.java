package org.etfbl.administrator;

import org.etfbl.administrator.gui.LoginFrame;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import javax.swing.*;

@SpringBootApplication
public class AdministratorApplication {

	public static void main(String[] args) {
        System.setProperty("java.awt.headless", "false");

        ConfigurableApplicationContext context = SpringApplication.run(AdministratorApplication.class, args);

        SwingUtilities.invokeLater(() -> {
            LoginFrame loginFrame = context.getBean(LoginFrame.class);
            loginFrame.setVisible(true);
        });
	}

}

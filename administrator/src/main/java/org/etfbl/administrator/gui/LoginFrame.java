package org.etfbl.administrator.gui;

import org.etfbl.administrator.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.awt.*;

@Component
public class LoginFrame extends JFrame {

    @Autowired
    private LoginService loginService;

    private JTextField usernameField;
    private JPasswordField passwordField;

    public LoginFrame() {
        setTitle("Hefest - Admin");
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setMinimumSize(new Dimension(1000,1000));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        ImageIcon logo = new ImageIcon(getClass().getResource("/images/hefest-logo.png"));
        setIconImage(logo.getImage());

        // Glavni panel
        JPanel mainPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g.create();
                int width = getWidth();
                int height = getHeight();

                // Gradijent: centar bijeli, ivice sive
                float[] dist = {0.0f, 0.5f, 0.6f, 0.7f, 0.8f, 0.85f, 0.9f, 0.94f, 0.97f, 1.0f};
                Color[] colors = {
                        Color.WHITE,
                        new Color(250, 250, 250),
                        new Color(230, 230, 230),
                        new Color(200, 200, 200),
                        new Color(150, 150, 150),
                        new Color(130, 130, 130),
                        new Color(110, 110, 110),
                        new Color(105, 105, 105),
                        new Color(95, 95, 95),
                        new Color(90, 90, 90)
                };

                RadialGradientPaint rgp = new RadialGradientPaint(
                        new Point(width/2, height/2),
                        Math.max(width, height)/2,
                        dist,
                        colors
                );

                g2d.setPaint(rgp);
                g2d.fillRect(0, 0, width, height);
                g2d.dispose();
            }
        };
        mainPanel.setLayout(new BoxLayout(mainPanel, BoxLayout.Y_AXIS));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(30, 50, 30, 50));

        // Logo
        Image scaledImage = logo.getImage().getScaledInstance(180, 180, Image.SCALE_SMOOTH);
        JPanel logoPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                g.drawImage(scaledImage, 0, 0, this);
                g.setFont(new Font("SansSerif", Font.BOLD, 18));
                g.setColor(Color.decode("#2E2F2E"));
                g.drawString("Admin", 63, 35);
            }
        };
        logoPanel.setPreferredSize(new Dimension(180, 180));
        logoPanel.setMaximumSize(new Dimension(180, 180));
        logoPanel.setOpaque(false);
        logoPanel.setLayout(null);
        logoPanel.setAlignmentX(java.awt.Component.CENTER_ALIGNMENT);

        // Sign in naslov
        JLabel signInLabel = new JLabel("Sign in", SwingConstants.CENTER);
        signInLabel.setFont(new Font("SansSerif", Font.BOLD, 30));
        signInLabel.setAlignmentX(java.awt.Component.CENTER_ALIGNMENT);
        signInLabel.setBorder(BorderFactory.createEmptyBorder(20, 0, 20, 0));

        // Ikona korisnika
        ImageIcon userIconImg = new ImageIcon(getClass().getResource("/images/login-icon.png"));
        JLabel userIcon = new JLabel(userIconImg);
        userIcon.setAlignmentX(java.awt.Component.CENTER_ALIGNMENT);
        userIcon.setBorder(BorderFactory.createEmptyBorder(10, 0, 20, 0));

        // Korisnicko ime
        usernameField = new JTextField();
        usernameField.setPreferredSize(new Dimension(400, 60));
        usernameField.setMaximumSize(new Dimension(400, 60));
        usernameField.setFont(new Font("SansSerif", Font.PLAIN, 16));
        usernameField.setBorder(BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(Color.GRAY),
                "Username",
                0, 0,
                new Font("SansSerif", Font.BOLD, 16))
        );

        // Lozinka
        passwordField = new JPasswordField();
        passwordField.setPreferredSize(new Dimension(400, 60));
        passwordField.setMaximumSize(new Dimension(400, 60));
        passwordField.setFont(new Font("SansSerif", Font.PLAIN, 16));
        passwordField.setBorder(BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(Color.GRAY),
                "Password",
                0, 0,
                new Font("SansSerif", Font.BOLD, 16))
        );

        // Dugme za login
        JButton loginButton = new JButton("Log in");
        loginButton.setAlignmentX(java.awt.Component.CENTER_ALIGNMENT);
        loginButton.setFocusPainted(false);
        loginButton.setBackground(Color.decode("#2E2F2E"));
        loginButton.setForeground(Color.WHITE);
        loginButton.setFont(new Font("SansSerif", Font.PLAIN, 20));
        loginButton.setPreferredSize(new Dimension(150, 55));
        loginButton.setMaximumSize(new Dimension(150, 55));
        loginButton.addActionListener(e -> handleLogin());

        // Dodavanje svih elemenata u main panel
        mainPanel.add(Box.createVerticalStrut(10));
        mainPanel.add(logoPanel);
        mainPanel.add(signInLabel);
        mainPanel.add(userIcon);
        mainPanel.add(Box.createVerticalStrut(10));
        mainPanel.add(usernameField);
        mainPanel.add(Box.createVerticalStrut(15));
        mainPanel.add(passwordField);
        mainPanel.add(Box.createVerticalStrut(25));
        mainPanel.add(loginButton);

        add(mainPanel);
    }

    private void handleLogin() {
        String username = usernameField.getText().trim();
        String password = new String(passwordField.getPassword());

        if (username.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Unesite korisničko ime i lozinku.", "Greška", JOptionPane.ERROR_MESSAGE);
            return;
        }

        boolean success = loginService.login(username, password);

        if (success) {
            dispose();
            new AdminDashboardFrame().setVisible(true);
        }
        else {
            JOptionPane.showMessageDialog(this, "Pogrešno korisničko ime ili lozinka.", "Greška", JOptionPane.ERROR_MESSAGE);
        }
    }
}


package org.etfbl.administrator.gui;

import org.etfbl.administrator.AdministratorApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.net.URL;

@Component
public class AdminDashboardFrame extends JFrame {
    private JPanel wrapperPanel;
    private JPanel leftPanel;
    private JPanel bottomPanel;
    private JPanel mainPanel;
    private ImageIcon logoIcon;

    public AdminDashboardFrame() {
        setTitle("Hefest - Admin");
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setMinimumSize(new Dimension(1000, 700));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        logoIcon = new ImageIcon(getClass().getResource("/images/hefest-logo.png"));
        setIconImage(logoIcon.getImage());

        initLeftPanel();
        initMainPanel();

        add(wrapperPanel, BorderLayout.WEST);
        add(mainPanel, BorderLayout.CENTER);
    }

    private void initLeftPanel() {
        wrapperPanel = new JPanel(new BorderLayout());
        wrapperPanel.setPreferredSize(new Dimension(230, getHeight()));
        wrapperPanel.setBackground(Color.WHITE);
        wrapperPanel.setBorder(BorderFactory.createMatteBorder(0, 0, 0, 1, Color.BLACK));

        leftPanel = new JPanel();
        leftPanel.setBackground(Color.WHITE);
        leftPanel.setLayout(new BoxLayout(leftPanel, BoxLayout.Y_AXIS));

        // logo
        JLabel logoLabel = new JLabel();
        logoLabel.setPreferredSize(new Dimension(230, 60));
        logoLabel.setMaximumSize(new Dimension(230, 60));
        logoLabel.setAlignmentX(CENTER_ALIGNMENT);
        logoLabel.setHorizontalAlignment(SwingConstants.CENTER);
        logoLabel.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));

        Image scaledImage = logoIcon.getImage().getScaledInstance(60, 60, Image.SCALE_SMOOTH);
        logoLabel.setIcon(new ImageIcon(scaledImage));

        leftPanel.add(Box.createVerticalStrut(10));
        leftPanel.add(logoLabel);
        leftPanel.add(Box.createVerticalStrut(10));

        // pregled button
        JButton pregledButton = novoDugme("Pregled korisnika");

        // TODO
        // pregledButton.addActionListener();

        leftPanel.add(pregledButton);
        leftPanel.add(Box.createVerticalStrut(10));

        // logout button
        bottomPanel = new JPanel();
        bottomPanel.setBackground(Color.WHITE);
        bottomPanel.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, Color.BLACK));
        bottomPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 0, 15));

        JLabel logoutLabel = new JLabel();
        ImageIcon logoutIcon = new ImageIcon(getClass().getResource("/images/logout-icon.png"));
        Image scaled = logoutIcon.getImage().getScaledInstance(24, 24, Image.SCALE_SMOOTH);
        logoutLabel.setIcon(new ImageIcon(scaled));

        logoutLabel.setToolTipText("Odjava");
        logoutLabel.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                odjava();
            }
        });
        bottomPanel.add(logoutLabel);

        wrapperPanel.add(leftPanel, BorderLayout.CENTER);
        wrapperPanel.add(bottomPanel, BorderLayout.SOUTH);
    }

    private void initMainPanel() {
        mainPanel = new JPanel(new BorderLayout());
        mainPanel.setBackground(Color.WHITE);

        JLabel backgroundLabel = new JLabel();
        backgroundLabel.setHorizontalAlignment(SwingConstants.CENTER);
        backgroundLabel.setVerticalAlignment(SwingConstants.CENTER);

        Image scaledImage = logoIcon.getImage().getScaledInstance(600, 600, Image.SCALE_SMOOTH);
        ImageIcon transparentIcon = createTransparentIcon(new ImageIcon(scaledImage), 0.3f);
        backgroundLabel.setIcon(transparentIcon);

        mainPanel.add(backgroundLabel, BorderLayout.CENTER);
    }

    private ImageIcon createTransparentIcon(ImageIcon icon, float alpha) {
        BufferedImage buffered = new BufferedImage(
                icon.getIconWidth(),
                icon.getIconHeight(),
                BufferedImage.TYPE_INT_ARGB
        );

        Graphics2D g2d = buffered.createGraphics();
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, alpha));
        g2d.drawImage(icon.getImage(), 0, 0, null);
        g2d.dispose();

        return new ImageIcon(buffered);
    }

    private JButton novoDugme(String text) {
        JButton button = new JButton(text);
        button.setFocusPainted(false);
        button.setBackground(new Color(223, 222, 224));
        button.setBorder(BorderFactory.createLineBorder(Color.GRAY));
        button.setPreferredSize(new Dimension(231, 60));
        button.setMaximumSize(new Dimension(231, 60));
        button.setAlignmentX(CENTER_ALIGNMENT);
        return button;
    }

    private void odjava() {
        JOptionPane.showMessageDialog(this, "Odjavljeni ste sa sistema", "Poruka", JOptionPane.INFORMATION_MESSAGE);
        dispose();
        SwingUtilities.invokeLater(() -> {
            LoginFrame login = AdministratorApplication.context.getBean(LoginFrame.class);
            login.resetFields();
            login.setVisible(true);
        });
    }

}
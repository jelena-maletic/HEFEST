package org.etfbl.administrator.gui;

import org.etfbl.administrator.model.Korisnik;
import org.etfbl.administrator.service.KorisnikService;
import org.etfbl.administrator.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.WindowEvent;

@Component
@Scope("prototype")
public class KorisnikDialog extends JDialog {
    private KorisnikDialog ovaj;

    private boolean izmjena;

    private Korisnik korisnik;
    private String dialogResult = "Cancel";

    @Autowired
    private KorisnikService korisnikService;

    @Autowired
    private LoginService loginService;

    private JTextField tfJMB;
    private JTextField tfUsername;
    private JPasswordField pfPassword;
    private JTextField tfEmail;
    private JTextField tfIme;
    private JTextField tfPrezime;
    private JTextField tfBrojTelefona;
    private JComboBox<String> cbTipKorisnika;

    public KorisnikDialog() {
        ovaj = this;
        izmjena = false;
        initialize();
    }

    public KorisnikDialog(Korisnik korisnik) {
        ovaj = this;
        izmjena = true;
        this.korisnik = korisnik;
        initialize();

        tfJMB.setText(korisnik.getJmb());
        tfJMB.setEditable(false);
        tfUsername.setText(korisnik.getUsername());
        tfEmail.setText(korisnik.getEmail());
        tfIme.setText(korisnik.getIme());
        tfPrezime.setText(korisnik.getPrezime());
        tfBrojTelefona.setText(korisnik.getBrojTelefona());
        cbTipKorisnika.setSelectedItem(korisnik.getClass().getSimpleName());
    }

    public String getDialogResult() {
        return dialogResult;
    }

    public void setKorisnik(Korisnik korisnik) {
        this.korisnik = korisnik;
        if (korisnik != null) {
            tfJMB.setText(korisnik.getJmb());
            tfIme.setText(korisnik.getIme());
            tfPrezime.setText(korisnik.getPrezime());
            tfEmail.setText(korisnik.getEmail());
            tfBrojTelefona.setText(korisnik.getBrojTelefona());
            tfUsername.setText(korisnik.getUsername());
            cbTipKorisnika.setSelectedItem(korisnik.getClass().getSimpleName());
        }
    }

    public void setIzmjena(boolean izmjena) {
        this.izmjena = izmjena;
    }

    public boolean isOkPressed() {
        return "OK".equals(dialogResult);
    }

    private void initialize() {
        setResizable(false);
        setModalityType(ModalityType.APPLICATION_MODAL);
        setTitle("Korisnik");
        setBounds(100, 100, 400, 400);
        setLocationRelativeTo(null);
        getContentPane().setLayout(new BorderLayout());

        JPanel contentPanel = new JPanel();
        contentPanel.setBorder(new EmptyBorder(10, 10, 10, 10));
        contentPanel.setLayout(new GridLayout(0, 1, 5, 5));
        getContentPane().add(contentPanel, BorderLayout.CENTER);

        contentPanel.add(formRow("Tip korisnika:", cbTipKorisnika = new JComboBox<>(
                new String[]{"Tehnicar", "Poslovodja", "Magacioner", "Knjigovodja", "Direktor"}
        )));
        contentPanel.add(formRow("JMB:", tfJMB = new JTextField()));
        contentPanel.add(formRow("Ime:", tfIme = new JTextField()));
        contentPanel.add(formRow("Prezime:", tfPrezime = new JTextField()));
        contentPanel.add(formRow("Username:", tfUsername = new JTextField()));
        contentPanel.add(formRow("Email:", tfEmail = new JTextField()));
        contentPanel.add(formRow("Password:", pfPassword = new JPasswordField()));
        contentPanel.add(formRow("Broj telefona:", tfBrojTelefona = new JTextField()));

        JPanel buttonPane = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        buttonPane.setBorder(new EmptyBorder(0, 0, 5, 5));
        getContentPane().add(buttonPane, BorderLayout.SOUTH);

        JButton okButton = new JButton("Sačuvaj");
        okButton.setBackground(Color.decode("#2E2F2E"));
        okButton.setForeground(Color.WHITE);
        okButton.setFont(new Font("SansSerif", Font.PLAIN, 12));
        okButton.addActionListener(this::handleSave);
        buttonPane.add(okButton);
        getRootPane().setDefaultButton(okButton);

        JButton cancelButton = new JButton("Otkaži");
        cancelButton.setBackground(Color.decode("#2E2F2E"));
        cancelButton.setForeground(Color.WHITE);
        cancelButton.setFont(new Font("SansSerif", Font.PLAIN, 12));
        cancelButton.addActionListener(e -> {
            dialogResult = "Cancel";
            ovaj.getToolkit().getSystemEventQueue().postEvent(
                    new WindowEvent(ovaj, WindowEvent.WINDOW_CLOSING));
        });
        buttonPane.add(cancelButton);
    }

    private JPanel formRow(String labelText, JComponent field) {
        JPanel panel = new JPanel(new BorderLayout(5, 0));
        JLabel label = new JLabel(labelText);
        label.setPreferredSize(new Dimension(100, 25));
        label.setFont(new Font("SansSerif", Font.BOLD, 13));
        panel.add(label, BorderLayout.WEST);
        panel.add(field, BorderLayout.CENTER);
        return panel;
    }

    private void handleSave(ActionEvent e) {
        try {
            String jmb = tfJMB.getText().trim();
            String username = tfUsername.getText().trim();
            String password = new String(pfPassword.getPassword()).trim();
            String email = tfEmail.getText().trim();
            String ime = tfIme.getText().trim();
            String prezime = tfPrezime.getText().trim();
            String brojTelefona = tfBrojTelefona.getText().trim();

            if (jmb.isEmpty() || username.isEmpty() || (!izmjena && password.isEmpty()) || ime.isEmpty() || prezime.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Nisu popunjena sva neophodna polja!", "Greška", JOptionPane.ERROR_MESSAGE);
                return;
            }

            String tip = (String) cbTipKorisnika.getSelectedItem();
            boolean tipPromijenjen = izmjena && korisnik != null && !tip.equals(korisnik.getClass().getSimpleName());

            if (izmjena) {
                if (tipPromijenjen) {
                    korisnikService.deleteKorisnik(jmb);

                    String adminUsername = loginService.getAdministrator().getKorisnickoIme();
                    korisnikService.addKorisnik(jmb, username, password, email, ime, prezime, brojTelefona, adminUsername, tip);
                }
                else {
                    korisnik.setUsername(username);
                    korisnik.setIme(ime);
                    korisnik.setPrezime(prezime);
                    korisnik.setEmail(email);
                    korisnik.setBrojTelefona(brojTelefona);
                    korisnikService.updateKorisnik(korisnik, password.isEmpty() ? null : password);
                }
            }
            else {
                String adminUsername = loginService.getAdministrator().getKorisnickoIme();
                korisnikService.addKorisnik(jmb, username, password, email, ime, prezime, brojTelefona, adminUsername, tip);
            }

            dialogResult = "OK";
            ovaj.getToolkit().getSystemEventQueue().postEvent(
                    new WindowEvent(ovaj, WindowEvent.WINDOW_CLOSING));

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Greška", JOptionPane.ERROR_MESSAGE);
        }
    }
}

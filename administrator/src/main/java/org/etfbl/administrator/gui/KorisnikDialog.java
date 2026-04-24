package org.etfbl.administrator.gui;

import org.etfbl.administrator.model.Korisnik;
import org.etfbl.administrator.service.KorisnikService;
import org.etfbl.administrator.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
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
    private JLabel lblJmbError, lblEmailError, lblTelefonError;

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

        validateJmb();
        validateEmail();
        validateTelefon();
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
        setBounds(100, 100, 450, 550);
        setLocationRelativeTo(null);
        getContentPane().setLayout(new BorderLayout());

        JPanel contentPanel = new JPanel();
        contentPanel.setBorder(new EmptyBorder(10, 10, 10, 10));
        contentPanel.setLayout(new GridLayout(0, 1, 2, 2));
        getContentPane().add(contentPanel, BorderLayout.CENTER);

        tfJMB = new JTextField();
        lblJmbError = new JLabel(" ");

        tfEmail = new JTextField();
        lblEmailError = new JLabel(" ");

        tfBrojTelefona = new JTextField();
        lblTelefonError = new JLabel(" ");

        addValidationListener(tfJMB, this::validateJmb);
        addValidationListener(tfEmail, this::validateEmail);
        addValidationListener(tfBrojTelefona, this::validateTelefon);

        contentPanel.add(formRow("Tip korisnika:", cbTipKorisnika = new JComboBox<>(
                new String[]{"Tehnicar", "Poslovodja", "Magacioner", "Knjigovodja", "Direktor"}
        )));
        contentPanel.add(formRowWithValidation("JMB:", tfJMB, lblJmbError));
        contentPanel.add(formRow("Ime:", tfIme = new JTextField()));
        contentPanel.add(formRow("Prezime:", tfPrezime = new JTextField()));
        contentPanel.add(formRow("Korisničko ime:", tfUsername = new JTextField()));
        contentPanel.add(formRowWithValidation("Email:", tfEmail, lblEmailError));
        contentPanel.add(formRow("Lozinka:", pfPassword = new JPasswordField()));
        contentPanel.add(formRowWithValidation("Broj telefona:", tfBrojTelefona, lblTelefonError));

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

    private JPanel formRowWithValidation(String labelText, JComponent field, JLabel errorLabel) {
        JPanel container = new JPanel(new BorderLayout());
        JPanel inputRow = new JPanel(new BorderLayout(5, 0));
        JLabel label = new JLabel(labelText);
        label.setPreferredSize(new Dimension(100, 25));
        label.setFont(new Font("SansSerif", Font.BOLD, 13));
        errorLabel.setBorder(new EmptyBorder(0, 105, 0, 0));

        inputRow.add(label, BorderLayout.WEST);
        inputRow.add(field, BorderLayout.CENTER);

        errorLabel.setForeground(Color.RED);
        errorLabel.setFont(new Font("SansSerif", Font.PLAIN, 10));

        container.add(inputRow, BorderLayout.CENTER);
        container.add(errorLabel, BorderLayout.SOUTH);
        return container;
    }

    private void handleSave(ActionEvent e) {
        validateJmb();
        validateEmail();
        validateTelefon();

        if (!lblJmbError.getText().equals(" ") || !lblEmailError.getText().equals(" ") || !lblTelefonError.getText().equals(" ")) {
            JOptionPane.showMessageDialog(this, "Molimo Vas ispravite greške u poljima.", "Greška", JOptionPane.WARNING_MESSAGE);
            return;
        }

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

            Korisnik postojeci = korisnikService.getKorisnikByUsername(username);

            if (postojeci != null) {
                if (!izmjena || !postojeci.getJmb().equals(korisnik.getJmb())) {
                    JOptionPane.showMessageDialog(this, "Korisničko ime '" + username + "' je već zauzeto!", "Greška", JOptionPane.ERROR_MESSAGE);
                    return;
                }
            }

            if ((!izmjena && password.length() < 8) || (izmjena && !password.isEmpty() && password.length() < 8)) {
                JOptionPane.showMessageDialog(this, "Lozinka mora imati najmanje 8 karaktera!", "Greška", JOptionPane.WARNING_MESSAGE);
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

    private void addValidationListener(JTextField field, Runnable validationMethod) {
        field.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { validationMethod.run(); }
            public void removeUpdate(DocumentEvent e) { validationMethod.run(); }
            public void changedUpdate(DocumentEvent e) { validationMethod.run(); }
        });
    }

    private void validateJmb() {
        String jmb = tfJMB.getText().trim();
        if (jmb.matches("\\d{13}")) {
            lblJmbError.setText(" ");
            tfJMB.setBorder(UIManager.getLookAndFeel().getDefaults().getBorder("TextField.border"));
        } else {
            lblJmbError.setText("JMB mora imati tačno 13 cifara!");
            tfJMB.setBorder(BorderFactory.createLineBorder(Color.RED));
        }
    }

    private void validateEmail() {
        String email = tfEmail.getText().trim();
        String regex = "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b";
        if (email.matches(regex)) {
            lblEmailError.setText(" ");
            tfEmail.setBorder(UIManager.getLookAndFeel().getDefaults().getBorder("TextField.border"));
        } else {
            lblEmailError.setText("Email format nije ispravan!");
            tfEmail.setBorder(BorderFactory.createLineBorder(Color.RED));
        }
    }

    private void validateTelefon() {
        String tel = tfBrojTelefona.getText().trim();
        if (tel.matches("\\d{9,20}")) {
            lblTelefonError.setText(" ");
            tfBrojTelefona.setBorder(UIManager.getLookAndFeel().getDefaults().getBorder("TextField.border"));
        } else {
            lblTelefonError.setText("Dozvoljene su samo cifre (min 9, max 20)!");
            tfBrojTelefona.setBorder(BorderFactory.createLineBorder(Color.RED));
        }
    }

}

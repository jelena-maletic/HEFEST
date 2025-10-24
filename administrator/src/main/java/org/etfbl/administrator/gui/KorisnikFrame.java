package org.etfbl.administrator.gui;

import jakarta.annotation.PostConstruct;
import org.etfbl.administrator.model.Korisnik;
import org.etfbl.administrator.service.KorisnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.swing.*;
import javax.swing.border.TitledBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.List;

@Component
public class KorisnikFrame extends JFrame {
    private final KorisnikService korisnikService;
    private KorisnikFrame ovaj;
    private List<Korisnik> korisnici;
    private ImageIcon logoIcon;

    private JPanel contentPane;
    private JTable table;
    private JTextField tfPretraga;

    private JButton btnDodaj;
    private JButton btnIzmijeni;
    private JButton btnObrisi;
    private JButton btnPretrazi;
    private JButton btnPrikaziSve;

    @Autowired
    public KorisnikFrame(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;

        logoIcon = new ImageIcon(getClass().getResource("/images/hefest-logo.png"));
        setIconImage(logoIcon.getImage());
    }

    @PostConstruct
    public void init() {
        ovaj = this;
        korisnici = korisnikService.getAll();
        initialize();
    }

    private void osvjeziTabelu(String filter) {
        if (filter == null || filter.trim().isEmpty() || filter.equals("*")) {
            korisnici = korisnikService.getAll();
        } else {
            korisnici = korisnikService.search(filter);
        }

        KorisnikTableModel model = (KorisnikTableModel) table.getModel();
        model.setPodaci(korisnici);
        model.fireTableDataChanged();
    }

    private void initialize() {
        setTitle("Korisnici");
        setBounds(100, 100, 1200, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        contentPane = new JPanel(new BorderLayout(0, 0));
        contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
        setContentPane(contentPane);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(getPanelOpcije(), BorderLayout.NORTH);
        topPanel.add(getPanelPretraga(), BorderLayout.SOUTH);
        contentPane.add(topPanel, BorderLayout.NORTH);

        contentPane.add(getPanelPodaci(), BorderLayout.CENTER);
    }

    private JPanel getPanelOpcije() {
        JPanel panelOpcije = new JPanel(null);
        panelOpcije.setPreferredSize(new Dimension(200, 68));
        panelOpcije.add(getBtnDodaj());
        panelOpcije.add(getBtnIzmijeni());
        panelOpcije.add(getBtnObrisi());
        return panelOpcije;
    }

    private JPanel getPanelPretraga() {
        JPanel panelPretraga = new JPanel(null);
        panelPretraga.setPreferredSize(new Dimension(200, 70));
        TitledBorder border = new TitledBorder("Pretraga korisnika");
        border.setTitleFont(new Font("SansSerif", Font.BOLD, 12));
        panelPretraga.setBorder(border);

        JLabel lblPretraga = new JLabel("Unesite ime, prezime ili username:");
        lblPretraga.setBounds(10, 20, 350, 14);
        lblPretraga.setFont(new Font("SansSerif", Font.BOLD, 12));
        panelPretraga.add(lblPretraga);

        tfPretraga = new JTextField("*");
        tfPretraga.setBounds(10, 38, 350, 23);
        tfPretraga.setFont(new Font("SansSerif", Font.PLAIN, 12));
        tfPretraga.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER)
                    btnPretrazi.doClick();
            }
        });
        panelPretraga.add(tfPretraga);

        btnPretrazi = new JButton("Pretraži");
        btnPretrazi.setBounds(370, 37, 100, 23);
        btnPretrazi.setFont(new Font("SansSerif", Font.PLAIN, 12));
        btnPretrazi.setBackground(Color.decode("#2E2F2E"));
        btnPretrazi.setForeground(Color.WHITE);
        btnPretrazi.addActionListener(e -> osvjeziTabelu(tfPretraga.getText()));
        panelPretraga.add(btnPretrazi);

        btnPrikaziSve = new JButton("Prikaži sve");
        btnPrikaziSve.setBounds(480, 37, 100, 23);
        btnPrikaziSve.setFont(new Font("SansSerif", Font.PLAIN, 12));
        btnPrikaziSve.setBackground(Color.decode("#2E2F2E"));
        btnPrikaziSve.setForeground(Color.WHITE);
        btnPrikaziSve.addActionListener(e -> {
            tfPretraga.setText("*");
            osvjeziTabelu("*");
        });
        panelPretraga.add(btnPrikaziSve);

        return panelPretraga;
    }

    private JPanel getPanelPodaci() {
        JPanel panel = new JPanel(new BorderLayout(0, 0));
        JScrollPane scrollPane = new JScrollPane(getTable());
        scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);
        panel.add(scrollPane, BorderLayout.CENTER);
        return panel;
    }

    private JTable getTable() {
        if (table == null) {
            table = new JTable(new KorisnikTableModel(korisnici));
            table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
            table.setFillsViewportHeight(true);
            table.getColumnModel().getColumn(0).setPreferredWidth(140);
            table.getColumnModel().getColumn(1).setPreferredWidth(150);
            table.getColumnModel().getColumn(2).setPreferredWidth(150);
            table.getColumnModel().getColumn(3).setPreferredWidth(180);
            table.getColumnModel().getColumn(4).setPreferredWidth(350);
            table.getColumnModel().getColumn(5).setPreferredWidth(100);

            JTableHeader header = table.getTableHeader();
            header.setBackground(Color.decode("#2E2F2E"));
            header.setForeground(Color.WHITE);
            header.setFont(new Font("SansSerif", Font.BOLD, 13));

            table.setFont(new Font("SansSerif", Font.PLAIN, 13));
        }

        return table;
    }

    private JButton getBtnDodaj() {
        if (btnDodaj == null) {
            ImageIcon addIcon = new ImageIcon(getClass().getResource("/images/add-icon.png"));
            Image scaledAddImage = addIcon.getImage().getScaledInstance(64, 64, Image.SCALE_SMOOTH);
            btnDodaj = new JButton(new ImageIcon(scaledAddImage));
            btnDodaj.setBounds(0, 0, 58, 58);
            btnDodaj.setBackground(Color.WHITE);
            btnDodaj.setToolTipText("Dodaj novog korisnika");
            btnDodaj.addActionListener(e -> {
                KorisnikDialog dialog = new KorisnikDialog();
                dialog.setVisible(true);
                if (dialog.isOkPressed()) {
                    osvjeziTabelu("*");
                    JOptionPane.showMessageDialog(ovaj, "Korisnik uspješno dodat!");
                }
            });
        }
        return btnDodaj;
    }

    private JButton getBtnIzmijeni() {
        if (btnIzmijeni == null) {
            ImageIcon editIcon = new ImageIcon(getClass().getResource("/images/edit-icon.png"));
            Image scaledEditImage = editIcon.getImage().getScaledInstance(60, 60, Image.SCALE_SMOOTH);
            btnIzmijeni = new JButton(new ImageIcon(scaledEditImage));
            btnIzmijeni.setBounds(68, 0, 58, 58);
            btnIzmijeni.setBackground(Color.WHITE);
            btnIzmijeni.setToolTipText("Izmijeni korisnika");
            btnIzmijeni.addActionListener(e -> {
                int row = table.getSelectedRow();
                if (row == -1) {
                    JOptionPane.showMessageDialog(ovaj, "Nije odabran korisnik!", "Greška", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                Korisnik odabrani = ((KorisnikTableModel) table.getModel()).getKorisnikAtRow(row);
                KorisnikDialog dialog = new KorisnikDialog(odabrani);
                dialog.setVisible(true);
                if (dialog.isOkPressed()) {
                    osvjeziTabelu("*");
                    JOptionPane.showMessageDialog(ovaj, "Korisnik uspješno ažuriran!");
                }
            });
        }
        return btnIzmijeni;
    }

    private JButton getBtnObrisi() {
        if (btnObrisi == null) {
            ImageIcon deleteIcon = new ImageIcon(getClass().getResource("/images/delete-icon.png"));
            Image scaledDeleteImage = deleteIcon.getImage().getScaledInstance(42, 42, Image.SCALE_SMOOTH);
            btnObrisi = new JButton(new ImageIcon(scaledDeleteImage));
            btnObrisi.setBounds(136, 0, 58, 58);
            btnObrisi.setBackground(Color.WHITE);
            btnObrisi.setToolTipText("Obriši korisnika");
            btnObrisi.addActionListener(e -> {
                int row = table.getSelectedRow();
                if (row == -1) {
                    JOptionPane.showMessageDialog(ovaj, "Nije odabran korisnik!", "Greška", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                Korisnik odabrani = ((KorisnikTableModel) table.getModel()).getKorisnikAtRow(row);
                int izbor = JOptionPane.showConfirmDialog(ovaj,
                        "Da li ste sigurni da želite obrisati korisnika " + odabrani.getUsername() + "?",
                        "Potvrda brisanja", JOptionPane.YES_NO_OPTION);
                if (izbor == JOptionPane.YES_OPTION) {
                    korisnikService.deleteKorisnik(odabrani.getJmb());
                    osvjeziTabelu("*");
                    JOptionPane.showMessageDialog(ovaj, "Korisnik uspješno obrisan!");
                }
            });
        }
        return btnObrisi;
    }
}

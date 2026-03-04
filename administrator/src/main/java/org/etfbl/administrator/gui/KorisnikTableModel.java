package org.etfbl.administrator.gui;

import org.etfbl.administrator.model.Korisnik;
import javax.swing.table.AbstractTableModel;
import java.util.List;

public class KorisnikTableModel extends AbstractTableModel {
    private final String[] kolone = {"JMB", "Ime", "Prezime", "Username", "Email", "Broj telefona", "Tip korisnika"};
    private List<Korisnik> korisnici;

    public KorisnikTableModel(List<Korisnik> korisnici) {
        setPodaci(korisnici);
    }

    public void setPodaci(List<Korisnik> podaci) {
        this.korisnici = podaci;
    }

    public Korisnik getKorisnikAtRow(int rowIndex) {
        return korisnici.get(rowIndex);
    }

    @Override
    public int getColumnCount() {
        return kolone.length;
    }

    @Override
    public String getColumnName(int column) {
        return kolone[column];
    }

    @Override
    public int getRowCount() {
        return korisnici.size();
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        Korisnik k = korisnici.get(rowIndex);
        if (columnIndex == 0)
            return k.getJmb();
        else if (columnIndex == 1)
            return k.getIme();
        else if (columnIndex == 2)
            return k.getPrezime();
        else if (columnIndex == 3)
            return k.getUsername();
        else if (columnIndex == 4)
            return k.getEmail();
        else if (columnIndex == 5)
            return k.getBrojTelefona();
        else if (columnIndex == 6)
            return k.getClass().getSimpleName();
        else
            return null;
    }
}

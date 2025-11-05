package org.etfbl.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Administrator")
public class Administrator {

    @Id
    @Column(name = "KorisnickoIme")
    private String korisnickoIme;

    @Column(name = "Lozinka")
    private String lozinka;

    public Administrator() {}

    public Administrator(String korisnickoIme, String lozinka) {
        this.korisnickoIme = korisnickoIme;
        this.lozinka = lozinka;
    }

    public String getKorisnickoIme() {
        return korisnickoIme;
    }

    public void setKorisnickoIme(String korisnickoIme) {
        this.korisnickoIme = korisnickoIme;
    }

    public String getLozinka() {
        return lozinka;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

}
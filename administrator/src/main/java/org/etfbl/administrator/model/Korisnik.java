package org.etfbl.administrator.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class Korisnik {
    @Id
    private String jmb;
    private String username;
    private String password;
    private String email;
    private String ime;
    private String prezime;
    private String brojTelefona;

    @ManyToOne(optional = false)
    @JoinColumn(name = "Administrator_KorisnickoIme", referencedColumnName = "KorisnickoIme")
    private Administrator administrator;

    public Korisnik() {}
    public Korisnik(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        this.jmb = jmb;
        this.username = username;
        this.password = password;
        this.email = email;
        this.ime = ime;
        this.prezime = prezime;
        this.brojTelefona = brojTelefona;
    }

    public String getJmb() {
        return jmb;
    }

    public void setJmb(String jmb) {
        this.jmb = jmb;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getBrojTelefona() {
        return brojTelefona;
    }

    public void setBrojTelefona(String brojTelefona) {
        this.brojTelefona = brojTelefona;
    }

    public Administrator getAdministrator() {
        return administrator;
    }

    public void setAdministrator(Administrator administrator) {
        this.administrator = administrator;
    }
}
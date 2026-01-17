package org.etfbl.backend.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Korisnik")
public class KorisnikEntity {
    @Id
    @Column(name = "JMB")
    private String jmb;

    @Column(name = "KorisnickoIme")
    private String username;

    @Column(name = "Lozinka")
    private String password;

    @Column(name = "Email")
    private String email;

    @Column(name = "Ime")
    private String ime;

    @Column(name = "Prezime")
    private String prezime;

    @Column(name = "BrojTelefona")
    private String brojTelefona;

    @ManyToOne(optional = false)
    @JoinColumn(name = "Administrator_KorisnickoIme", referencedColumnName = "KorisnickoIme")
    private AdministratorEntity administratorEntity;

    public KorisnikEntity() {}
    public KorisnikEntity(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
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

    public AdministratorEntity getAdministrator() {
        return administratorEntity;
    }

    public void setAdministrator(AdministratorEntity administratorEntity) {
        this.administratorEntity = administratorEntity;
    }
}

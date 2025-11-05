package org.etfbl.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "Projekat")
public class Projekat {
    @Id
    @Column(name = "IdProjekta")
    private String idProjekta;

    @Column(name = "Opis")
    private String opis;

    @Column(name = "Rok")
    private LocalDateTime rok;

    @Column(name = "Lokacija")
    private String lokacija;

    @Column(name = "PocetakRada")
    private LocalDateTime pocetakRada;

    @Column(name = "KrajRada")
    private LocalDateTime krajRada;

    @Column(name = "Naziv")
    private String naziv;

    @Column(name = "Direktor_JMB")
    private String direktorJMB;

    public Projekat() {}

    public Projekat(String idProjekta, String opis, LocalDateTime rok, String lokacija, LocalDateTime pocetakRada, LocalDateTime krajRada, String naziv, String direktorJMB) {
        this.idProjekta = idProjekta;
        this.opis = opis;
        this.rok = rok;
        this.lokacija = lokacija;
        this.pocetakRada = pocetakRada;
        this.krajRada = krajRada;
        this.naziv = naziv;
        this.direktorJMB = direktorJMB;
    }


    public String getIdProjekta() {
        return idProjekta;
    }

    public void setIdProjekta(String idProjekta) {
        this.idProjekta = idProjekta;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public LocalDateTime getRok() {
        return rok;
    }

    public void setRok(LocalDateTime rok) {
        this.rok = rok;
    }

    public String getLokacija() {
        return lokacija;
    }

    public void setLokacija(String lokacija) {
        this.lokacija = lokacija;
    }

    public LocalDateTime getPocetakRada() {
        return pocetakRada;
    }

    public void setPocetakRada(LocalDateTime pocetakRada) {
        this.pocetakRada = pocetakRada;
    }

    public LocalDateTime getKrajRada() {
        return krajRada;
    }

    public void setKrajRada(LocalDateTime krajRada) {
        this.krajRada = krajRada;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getDirektorJMB() {
        return direktorJMB;
    }

    public void setDirektorJMB(String direktorJMB) {
        this.direktorJMB = direktorJMB;
    }
}

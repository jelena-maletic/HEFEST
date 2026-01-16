package org.etfbl.backend.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "Projekat")
public class Projekat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdProjekta", nullable = false)
    private Integer idProjekta;

    @Column(name = "Opis")
    private String opis;

    @Column(name = "Rok")
    private LocalDate rok;

    @Column(name = "Lokacija")
    private String lokacija;

    @Column(name = "PocetakRada")
    private LocalDate pocetakRada;

    @Column(name = "KrajRada")
    private LocalDate krajRada;

    @Column(name = "Naziv")
    private String naziv;

    @Column(name = "Direktor_JMB")
    private String direktorJMB;

    @Column(name = "Status", nullable = false, length = 45)
    private String status;

    @Column(name = "DatumKreiranja", nullable = false)
    private Instant datumKreiranja;

    @Column(name = "PosljednjaIzmjena")
    private Instant posljednjaIzmjena;

    @Column(name = "Prioritet", nullable = false, length = 45)
    private String prioritet;

    @Column(name = "Klijent", nullable = false, length = 45)
    private String klijent;

    public String getKlijent() {
        return klijent;
    }

    public void setKlijent(String klijent) {
        this.klijent = klijent;
    }

    public String getPrioritet() {
        return prioritet;
    }

    public void setPrioritet(String prioritet) {
        this.prioritet = prioritet;
    }

    public Instant getPosljednjaIzmjena() {
        return posljednjaIzmjena;
    }

    public void setPosljednjaIzmjena(Instant posljednjaIzmjena) {
        this.posljednjaIzmjena = posljednjaIzmjena;
    }

    public Instant getDatumKreiranja() {
        return datumKreiranja;
    }

    public void setDatumKreiranja(Instant datumKreiranja) {
        this.datumKreiranja = datumKreiranja;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Projekat() {}

    public Projekat(Integer idProjekta, String opis, LocalDate rok, String lokacija, LocalDate pocetakRada, LocalDate krajRada, String naziv, String direktorJMB) {
        this.idProjekta = idProjekta;
        this.opis = opis;
        this.rok = rok;
        this.lokacija = lokacija;
        this.pocetakRada = pocetakRada;
        this.krajRada = krajRada;
        this.naziv = naziv;
        this.direktorJMB = direktorJMB;
    }


    public Integer getIdProjekta() {
        return idProjekta;
    }

    public void setIdProjekta(Integer idProjekta) {
        this.idProjekta = idProjekta;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public LocalDate getRok() {
        return rok;
    }

    public void setRok(LocalDate rok) {
        this.rok = rok;
    }

    public String getLokacija() {
        return lokacija;
    }

    public void setLokacija(String lokacija) {
        this.lokacija = lokacija;
    }

    public LocalDate getPocetakRada() {
        return pocetakRada;
    }

    public void setPocetakRada(LocalDate pocetakRada) {
        this.pocetakRada = pocetakRada;
    }

    public LocalDate getKrajRada() {
        return krajRada;
    }

    public void setKrajRada(LocalDate krajRada) {
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

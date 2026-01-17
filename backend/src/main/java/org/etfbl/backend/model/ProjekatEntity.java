package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "Projekat")
public class ProjekatEntity {
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Direktor_JMB",referencedColumnName = "JMB", nullable = false)
    private DirektorEntity direktor;

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

}

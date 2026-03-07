package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "Projekat")
@SQLDelete(sql = "UPDATE Projekat SET Obrisan = 1 WHERE IdProjekta = ?")
@Where(clause = "Obrisan = 0")
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

    @ColumnDefault("0")
    @Column(name = "Obrisan", nullable = false)
    private Boolean obrisan = false;

    @ManyToMany
    @JoinTable(name = "poslovodja_upravlja_projektom",
            joinColumns = @JoinColumn(name = "IdProjekta"),
            inverseJoinColumns = @JoinColumn(name = "Poslovodja_JMB"))
    private Set<PoslovodjaEntity> poslovodje = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "tehnicar_na_projektu",
            joinColumns = @JoinColumn(name = "IdProjekta"),
            inverseJoinColumns = @JoinColumn(name = "Tehnicar_JMB"))
    private Set<TehnicarEntity> tehnicari = new LinkedHashSet<>();

}

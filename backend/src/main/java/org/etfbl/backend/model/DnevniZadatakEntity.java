package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "Dnevni_Zadatak")
public class DnevniZadatakEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdDnevnogZadatka", nullable = false)
    private Integer id;

    @Column(name = "Opis", length = 150)
    private String opis;

    @Column(name = "Zavrsen", nullable = false)
    private Boolean zavrsen;

    @Column(name = "Datum")
    private LocalDate datum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Dnevni_Izvjestaj_IdIzvjestaja", nullable = false)
    private DnevniIzvjestajEntity dnevniIzvjestaj;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Poslovodja_JMB", nullable = false)
    private PoslovodjaEntity poslovodja;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Tehnicar_JMB", nullable = false)
    private TehnicarEntity tehnicar;

}

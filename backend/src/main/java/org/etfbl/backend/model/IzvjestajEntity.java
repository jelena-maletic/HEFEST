package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Izvjestaj")
public class IzvjestajEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdIzvjestaja", nullable = false)
    private Integer id;

    @Column(name = "DatumKreiranja", nullable = false)
    private LocalDate datumKreiranja;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumns({
            @JoinColumn(name = "IdProjekta", referencedColumnName = "IdProjekta", nullable = false),
            @JoinColumn(name = "JMB_Poslovodja", referencedColumnName = "Poslovodja_JMB", nullable = false)
    })
    private PoslovodjaUpravljaProjektomEntity poslovodjaUpravljaProjektom;
}

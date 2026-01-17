package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Resurs")
public class ResursEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdResursa", nullable = false)
    private Integer id;

    @Column(name = "Naziv", nullable = false, length = 100)
    private String naziv;

    @Column(name = "Neispravan", nullable = false)
    private Boolean neispravan;

    @Column(name = "StanjeMagacina", nullable = false, precision = 5, scale = 2)
    private BigDecimal stanjeMagacina;

    @Column(name = "MinimalnaKolicina", precision = 5, scale = 2)
    private BigDecimal minimalnaKolicina;

}

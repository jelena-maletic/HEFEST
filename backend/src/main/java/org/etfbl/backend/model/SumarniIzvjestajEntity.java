package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "Sumarni_Izvjestaj")
public class SumarniIzvjestajEntity extends IzvjestajEntity {
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdIzvjestaja", nullable = false)
    private IzvjestajEntity izvjestaj;

    @Column(name = "PocetniDatum", nullable = false)
    private LocalDate pocetniDatum;

    @Column(name = "KrajnjiDatum", nullable = false)
    private LocalDate krajnjiDatum;

    @Column(name = "UkupniSatiRada", nullable = false, precision = 10)
    private BigDecimal ukupniSatiRada;

    @Column(name = "Opis", nullable = false)
    private String opis;

}

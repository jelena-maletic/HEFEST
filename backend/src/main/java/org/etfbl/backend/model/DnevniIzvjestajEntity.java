package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "Dnevni_Izvjestaj")
public class DnevniIzvjestajEntity extends IzvjestajEntity{
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdIzvjestaja", nullable = false)
    private IzvjestajEntity izvjestaj;

    @Column(name = "Datum", nullable = false)
    private LocalDate datum;

    @Column(name = "SatiRada", nullable = false, precision = 10)
    private BigDecimal satiRada;

    @Column(name = "NocniSati", precision = 10)
    private BigDecimal nocniSati;

    @Column(name = "PrekovremeniSati", precision = 10)
    private BigDecimal prekovremeniSati;

    @Column(name = "TerenskiSati", precision = 10)
    private BigDecimal terenskiSati;

    @Column(name = "UkupniSati", nullable = false, precision = 10)
    private BigDecimal ukupniSati;

    @Lob
    @Column(name = "OpisRadova")
    private String opisRadova;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Sumarni_Izvjestaj_IdIzvjestaja")
    private SumarniIzvjestajEntity sumarniIzvjestajIdizvjestaja;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Tehnicar_JMB", nullable = false)
    private TehnicarEntity tehnicar;
}

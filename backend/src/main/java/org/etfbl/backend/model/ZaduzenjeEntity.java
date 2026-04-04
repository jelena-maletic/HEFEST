package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name="Zaduzenje")
public class ZaduzenjeEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdZaduzenja", nullable = false)
    private Integer idZaduzenja;

    @Column(name = "DatumZaduzenja", nullable = false)
    private Instant datumZaduzenja;

    @Column(name = "DatumRazduzenja")
    private Instant datumRazduzenja;

    @Column(name = "ZaduzenaKolicina", nullable = false, precision = 5, scale = 2)
    private BigDecimal zaduzenaKolicina;

    @Column(name = "RazduzenaKolicina", precision = 5, scale = 2)
    private BigDecimal razduzenaKolicina;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "Poslovodja_JMB", referencedColumnName = "JMB",nullable = false)
    private PoslovodjaEntity poslovodja;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "Magacioner_JMB", referencedColumnName = "JMB", nullable = false)
    private MagacionerEntity magacioner;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "IdResursa",referencedColumnName = "IdResursa", nullable = false)
    private ResursEntity resurs;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdZahtjeva", referencedColumnName = "IdZahtjeva")
    private ZahtjevZaResursimaEntity zahtjev;
}

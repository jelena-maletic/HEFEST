package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.etfbl.backend.model.manytomanyid.MagacionerUpravljaResursomId;
import org.etfbl.backend.model.manytomanyid.ZaduzenjeId;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name="Zaduzenje")
@IdClass(ZaduzenjeId.class)
public class ZaduzenjeEntity implements Serializable {

    @Id
    @Column(name = "Poslovodja_JMB")
    private String poslovodjaJMB;

    @Id
    @Column(name = "IdResursa")
    private Integer idResursa;

    @MapsId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "Poslovodja_JMB", referencedColumnName = "JMB",nullable = false)
    private PoslovodjaEntity poslovodja;

    @MapsId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "IdResursa",referencedColumnName = "IdResursa", nullable = false)
    private ResursEntity resurs;

    @Column(name = "DatumZaduzenja", nullable = false)
    private Instant datumZaduzenja;

    @Column(name = "DatumRazduzenja")
    private Instant datumRazduzenja;

    @Column(name = "ZaduzenaKolicina", nullable = false, precision = 5, scale = 2)
    private BigDecimal zaduzenaKolicina;

    @Column(name = "RazduzenaKolicina", nullable = false, precision = 5, scale = 2)
    private BigDecimal razduzenaKolicina;

}

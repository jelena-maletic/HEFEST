package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.etfbl.backend.model.manytomanyid.ResursUZahtjevuId;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Entity
@Table(name="Resurs_U_Zahtjevu")
@IdClass(ResursUZahtjevuId.class)
public class ResursUZahtjevuEntity implements Serializable {

    @Id
    @Column(name = "IdZahtjeva")
    private Integer idZahtjeva;

    @Id
    @Column(name = "IdResursa")
    private Integer idResursa;

    @MapsId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "IdZahtjeva", referencedColumnName = "IdZahtjeva",nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ZahtjevZaResursimaEntity zahtjev;

    @MapsId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "IdResursa",referencedColumnName = "IdResursa", nullable = false)
    private ResursEntity resurs;

    @Column(name = "Kolicina", nullable = false, precision = 5, scale = 2)
    private BigDecimal kolicina;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "Zaduzenje_Poslovodja_JMB", referencedColumnName = "Poslovodja_JMB"),
            @JoinColumn(name = "Zaduzenje_IdResursa", referencedColumnName = "IdResursa")
    })
    private ZaduzenjeEntity zaduzenje;

    @Column(name = "OdobrenoZaduzenje")
    private Boolean odobrenoZaduzenje;

}

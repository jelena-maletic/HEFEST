package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "UtroseniMaterijal")
public class UtroseniMaterijalEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdUtrosenogMaterijala", nullable = false)
    private Integer id;

    @Column(name = "Etaza", length = 45)
    private String etaza;

    @Column(name = "Pozicija", nullable = false, length = 45)
    private String pozicija;

    @Column(name = "StrujniKrug", length = 45)
    private String strujniKrug;

    @Column(name = "Kolicina", nullable = false, precision = 5, scale = 2)
    private BigDecimal kolicina;

    @Column(name = "Namjena", length = 100)
    private String namjena;

    @Lob
    @Column(name = "Napomena")
    private String napomena;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdResursa", nullable = false)
    private MaterijalEntity materijal;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Dnevni_Izvjestaj_IdIzvjestaja", nullable = false)
    private DnevniIzvjestajEntity dnevniIzvjestaj;

}

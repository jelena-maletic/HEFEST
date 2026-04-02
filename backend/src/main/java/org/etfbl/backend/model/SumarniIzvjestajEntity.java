package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

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

    @ManyToMany
    @JoinTable(
            name = "sumarni_i_dnevni_izvjestaji",
            joinColumns = @JoinColumn(name = "Sumarni_Izvjestaj_Id"),
            inverseJoinColumns = @JoinColumn(name = "Dnevni_Izvjestaj_Id")
    )
    private List<DnevniIzvjestajEntity> dnevniIzvjestaji;

}

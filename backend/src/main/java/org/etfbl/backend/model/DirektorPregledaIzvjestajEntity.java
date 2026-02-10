package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.etfbl.backend.model.manytomanyid.DirektorPregledaIzvjestajId;
import org.etfbl.backend.model.manytomanyid.PoslovodjaUpravljaProjektomId;

@Data
@Entity
@Table(name="Direktor_Pregleda_Izvjestaj")
@IdClass(DirektorPregledaIzvjestajId.class)
public class DirektorPregledaIzvjestajEntity {

    @Id
    @Column(name="Direktor_JMB")
    private String direktorJMB;

    @Id
    @Column(name="IdIzvjestaja")
    private Integer idIzvjestaja;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Direktor_JMB", nullable = false)
    private DirektorEntity direktor;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdIzvjestaja", nullable = false)
    private IzvjestajEntity izvjestaj;

}

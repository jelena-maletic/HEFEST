package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.etfbl.backend.model.manytomanyid.PoslovodjaUpravljaProjektomId;
import org.etfbl.backend.model.manytomanyid.SumarniDnevniId;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@Entity
@Table(name="Sumarni_I_Dnevni_Izvjestaji")
@IdClass(SumarniDnevniId.class)
public class SumarniDnevniEntity {
    @Id
    @Column(name="Sumarni_Izvjestaj_Id")
    private Integer idSumarnogIzvjestaja;

    @Id
    @Column(name="Dnevni_Izvjestaj_Id")
    private Integer idDnevnogIzvjestaja;
    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "Sumarni_Izvjestaj_Id", nullable = false)
    private SumarniIzvjestajEntity sumarniIzvjestaj;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "Dnevni_Izvjestaj_Id", nullable = false)
    private DnevniIzvjestajEntity dnevniIzvjestaj;

}

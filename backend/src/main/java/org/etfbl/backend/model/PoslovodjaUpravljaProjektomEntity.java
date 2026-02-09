package org.etfbl.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.etfbl.backend.model.manytomanyid.PoslovodjaUpravljaProjektomId;

@Data
@Entity
@Table(name="Poslovodja_Upravlja_Projektom")
@IdClass(PoslovodjaUpravljaProjektomId.class)
public class PoslovodjaUpravljaProjektomEntity {
    @Id
    @Column(name="IdProjekta")
    private Integer idProjekta;

    @Id
    @Column(name="Poslovodja_JMB")
    private String poslovodjaJMB;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdProjekta", nullable = false)
    private ProjekatEntity projekat;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Poslovodja_JMB", nullable = false)
    private PoslovodjaEntity poslovodja;

}

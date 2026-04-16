package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name="Poslovodja_Upravlja_Projektom")
public class PoslovodjaUpravljaProjektomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Id", nullable=false)
    private Integer id;

    @Column(name="IdProjekta", insertable = false, updatable = false)
    private Integer idProjekta;

    @Column(name="Poslovodja_JMB", insertable = false, updatable = false)
    private String poslovodjaJMB;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdProjekta", nullable = false)
    private ProjekatEntity projekat;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Poslovodja_JMB", nullable = false)
    private PoslovodjaEntity poslovodja;



}

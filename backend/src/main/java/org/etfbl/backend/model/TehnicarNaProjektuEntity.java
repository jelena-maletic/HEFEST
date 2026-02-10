package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Tehnicar_Na_Projektu")
@IdClass(TehnicarNaProjektuEntity.class)
public class TehnicarNaProjektuEntity {
    @Id
    @Column(name="IdProjekta")
    private Integer idProjekta;

    @Id
    @Column(name="Tehnicar_JMB")
    private String tehnicarJMB;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdProjekta", nullable = false)
    private ProjekatEntity projekat;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Tehnicar_JMB", nullable = false)
    private TehnicarEntity tehnicar;

}

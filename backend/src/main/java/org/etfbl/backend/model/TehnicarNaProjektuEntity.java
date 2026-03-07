package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.etfbl.backend.model.manytomanyid.TehnicarNaProjektuId;

@Data
@Entity
@Table(name = "Tehnicar_Na_Projektu")
@IdClass(TehnicarNaProjektuId.class) // Koristi novu ID klasu!
public class TehnicarNaProjektuEntity {

    @Id
    @Column(name="IdProjekta")
    private Integer idProjekta;

    @Id
    @Column(name="Tehnicar_JMB")
    private String tehnicarJMB;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdProjekta", insertable = false, updatable = false) // Ključno!
    private ProjekatEntity projekat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Tehnicar_JMB", insertable = false, updatable = false) // Ključno!
    private TehnicarEntity tehnicar;
}
package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Radna_Oprema")
public class RadnaOpremaEntity extends ResursEntity {
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdResursa", nullable = false)
    private ResursEntity resurs;

    @Enumerated(EnumType.STRING)
    @Column(name = "Kategorija", nullable = false)
    private Kategorija kategorija;

}

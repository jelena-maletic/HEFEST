package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Radna_Oprema")
@PrimaryKeyJoinColumn(name = "IdResursa")
// Povezuje PK Radne Opreme sa PK Resursa
public class RadnaOpremaEntity extends ResursEntity {
    @Enumerated(EnumType.STRING)
    @Column(name = "Kategorija", nullable = false)
    private Kategorija kategorija;
}

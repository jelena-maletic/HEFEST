package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Materijal")
public class MaterijalEntity extends ResursEntity{
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdResursa", nullable = false)
    private ResursEntity resurs;

    @Column(name = "JedinicaMjere", nullable = false, length = 20)
    private String jedinicaMjere;

    @Column(name = "Kategorija", length = 45)
    private String kategorija;

}

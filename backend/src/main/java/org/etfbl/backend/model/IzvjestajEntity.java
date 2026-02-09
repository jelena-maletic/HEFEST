package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class IzvjestajEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdIzvjestaja", nullable = false)
    private Integer id;

    @Column(name = "DatumKreiranja", nullable = false)
    private LocalDate datumKreiranja;

}

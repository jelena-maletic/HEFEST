package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name="Vozilo")
public class VoziloEntity extends ResursEntity {

    @Column(unique = true, nullable = false)
    private String registarskiBroj;

    @Column(name = "BrojPutnika", nullable = false)
    private Integer brojPutnika;

    @Column(name = "MaksimalnaNosivost", precision = 10)
    private BigDecimal maksimalnaNosivost;

    @Enumerated(EnumType.STRING)
    @Column(name = "TipVozila", nullable = false)
    private TipVozila tipVozila;

    @Column(name = "DatumRegistracije", nullable = false)
    private LocalDate datumRegistracije;

    @Column(name = "DatumIstekaRegistracije", nullable = false)
    private LocalDate datumIstekaRegistracije;

}

enum TipVozila {
    putnicko,
    teretno,
    kombi
}

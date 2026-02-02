package org.etfbl.backend.dto;

import lombok.Data;
import org.etfbl.backend.model.TipVozila;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for {@link org.etfbl.backend.model.VoziloEntity}
 */
@Data
public class Vozilo implements Serializable {
    String naziv;
    BigDecimal stanjeMagacina;
    BigDecimal minimalnaKolicina;
    String registarskiBroj;
    Integer brojPutnika;
    BigDecimal maksimalnaNosivost;
    TipVozila tipVozila;
    LocalDate datumRegistracije;
    LocalDate datumIstekaRegistracije;
}
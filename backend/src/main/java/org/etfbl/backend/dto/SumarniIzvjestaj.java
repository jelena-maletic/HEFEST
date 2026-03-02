package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for {@link org.etfbl.backend.model.SumarniIzvjestajEntity}
 */
@Data
public class SumarniIzvjestaj implements Serializable {
    private Integer idIzvjestaja;
    private LocalDate datumKreiranja;
    //private Integer idProjekta;
    // String jmbPoslovodja;
    private Projekat projekat;
    private Poslovodja poslovodja;
    private LocalDate pocetniDatum;
    private LocalDate krajnjiDatum;
    private BigDecimal ukupniSatiRada;
    private String opis;
}
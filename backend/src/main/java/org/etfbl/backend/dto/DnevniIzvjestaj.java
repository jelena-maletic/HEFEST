package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;
import org.etfbl.backend.model.DnevniIzvjestajEntity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for {@link DnevniIzvjestajEntity}
 */
@Data
public class DnevniIzvjestaj implements Serializable {
    private Integer idIzvjestaja;
    private LocalDate datumKreiranja;
    private Integer idProjekta;
    private String jmbPoslovodja;
    private String jmbTehnicar;
    private LocalDate datum;
    private BigDecimal satiRada;
    private BigDecimal nocniSati;
    private BigDecimal prekovremeniSati;
    private BigDecimal terenskiSati;
    private BigDecimal ukupniSati;
    private String opisRadova;
}
package org.etfbl.backend.dto;

import lombok.Data;
import org.etfbl.backend.model.Kategorija;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link org.etfbl.backend.model.RadnaOpremaEntity}
 */
@Data
public class RadnaOprema implements Serializable {
    private Integer id;
    private String naziv;
    private BigDecimal stanjeMagacina;
    private BigDecimal minimalnaKolicina;
    private Kategorija kategorija;
}
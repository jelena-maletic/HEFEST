package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link org.etfbl.backend.model.MaterijalEntity}
 */
@Data
public class Materijal implements Serializable {
    String naziv;
    BigDecimal stanjeMagacina;
    BigDecimal minimalnaKolicina;
    String jedinicaMjere;
    String kategorija;
}
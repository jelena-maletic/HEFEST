package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;
import org.etfbl.backend.model.ResursEntity;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link ResursEntity}
 */
@Data
public class Resurs implements Serializable {
    String naziv;
    BigDecimal stanjeMagacina;
    BigDecimal minimalnaKolicina;
}
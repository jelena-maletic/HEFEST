package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;
import org.etfbl.backend.model.UtroseniMaterijalEntity;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link UtroseniMaterijalEntity}
 */
@Data
public class UtroseniMaterijal implements Serializable {
    String etaza;
    String pozicija;
    String strujniKrug;
    BigDecimal kolicina;
    String namjena;
    String napomena;
    Materijal materijal;
}
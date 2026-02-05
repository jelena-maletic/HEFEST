package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link org.etfbl.backend.model.ResursUZahtjevuEntity}
 */
@Data
public class ResursUZahtjevu implements Serializable {
    ResursNaziv resurs;
    BigDecimal kolicina;
    Boolean odobrenoZaduzenje;
}
package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO for {@link org.etfbl.backend.model.ZaduzenjeEntity}
 */
@Data
public class Zaduzenje implements Serializable {
    Poslovodja poslovodja;
    ResursNaziv resurs;
    Instant datumZaduzenja;
    Instant datumRazduzenja;
    BigDecimal zaduzenaKolicina;
    BigDecimal razduzenaKolicina;
}
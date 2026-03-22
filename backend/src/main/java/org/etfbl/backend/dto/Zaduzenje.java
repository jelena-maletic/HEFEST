package org.etfbl.backend.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
public class Zaduzenje implements Serializable {
    // Polja koja odgovaraju frontu i tvom patternu
    private String manager;      // JMB poslovodje
    private Integer resursId;    // ID resursa
    private String resourceType; // Tip (opciono, za front)

    private Instant datumZaduzenja;
    private Instant datumRazduzenja;
    private BigDecimal zaduzenaKolicina;
    private BigDecimal razduzenaKolicina;

    // Polja za prikaz u tabeli (ako zatreba nazivi)
    private String poslovodjaImePrezime;
    private String resursNaziv;
}
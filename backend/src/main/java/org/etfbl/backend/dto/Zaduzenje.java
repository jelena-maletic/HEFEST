package org.etfbl.backend.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
public class Zaduzenje implements Serializable {
    private Integer resursId;
    private String resursNaziv;
    private Integer idZaduzenja;
    private Integer idZahtjeva;
    private String poslovodjaJMB;
    private String poslovodjaImePrezime;
    private String magacionerJMB;
    private String magacionerImePrezime;
    private Instant datumZaduzenja;
    private Instant datumRazduzenja;
    private BigDecimal zaduzenaKolicina;
    private BigDecimal razduzenaKolicina;
    private String opisZahtjeva;
    private String resourceType;
}
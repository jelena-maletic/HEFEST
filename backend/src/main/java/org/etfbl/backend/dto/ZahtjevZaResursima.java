package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;
import org.etfbl.backend.model.StanjeZahtjeva;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link org.etfbl.backend.model.ZahtjevZaResursimaEntity}
 */
@Data
public class ZahtjevZaResursima implements Serializable {
    private Integer id;
    private Instant datumSlanja;
    private Instant datumObrade;
    private BigDecimal kolicina;
    private String opis;
    private StanjeZahtjeva stanjeZahtjeva;
    private String poslovodjaJMB;
    private String magacionerJMB;
    private Integer resursId;
    private String poslovodjaImePrezime;
    private String magacionerImePrezime;
    private String resursNaziv;
    private String resourceType;
}
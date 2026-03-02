package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;
import org.etfbl.backend.model.StanjeZahtjeva;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link org.etfbl.backend.model.ZahtjevZaResursimaEntity}
 */
@Data
public class ZahtjevZaResursima implements Serializable {
    Instant datumSlanja;
    Instant datumObrade;
    String opis;
    StanjeZahtjeva stanjeZahtjeva=StanjeZahtjeva.neobradjen;
    //Set<ResursUZahtjevu> resursUZahtjevu;
}
package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;
import org.etfbl.backend.model.ZaposleniEntity;

import java.io.Serializable;

/**
 * DTO for {@link ZaposleniEntity}
 */
@Data
public class Zaposleni implements Serializable {
    String jmb;
    String ime;
    String prezime;
    String brojTelefona;
}
package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.MagacionerEntity}
 */
@Data
public class Magacioner implements Serializable {
    String ime;
    String prezime;
    String brojTelefona;
}
package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.PoslovodjaEntity}
 */
@Data
public class Poslovodja implements Serializable {
    String ime;
    String prezime;
    String brojTelefona;
}
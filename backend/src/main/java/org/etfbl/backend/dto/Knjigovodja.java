package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.KnjigovodjaEntity}
 */
@Data
public class Knjigovodja implements Serializable {
    String ime;
    String prezime;
    String brojTelefona;
}
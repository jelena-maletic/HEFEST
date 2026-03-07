package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.TehnicarEntity}
 */
@Data
public class Tehnicar implements Serializable {
    String ime;
    String prezime;
    String jmb;
}
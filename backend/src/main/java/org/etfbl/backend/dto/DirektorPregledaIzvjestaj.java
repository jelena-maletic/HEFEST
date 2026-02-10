package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.DirektorPregledaIzvjestajEntity}
 */
@Data
public class DirektorPregledaIzvjestaj implements Serializable {
    String direktorJMB;
    Integer idIzvjestaja;
}
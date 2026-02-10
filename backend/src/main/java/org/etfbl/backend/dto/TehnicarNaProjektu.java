package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.TehnicarNaProjektuEntity}
 */
@Data
public class TehnicarNaProjektu implements Serializable {
    Integer idProjekta;
    String tehnicarJMB;
}
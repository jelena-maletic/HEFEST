package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.PoslovodjaUpravljaProjektomEntity}
 */
@Data
public class PoslovodjaUpravljaProjektom implements Serializable {
    Integer idProjekta;
    String poslovodjaJMB;
}
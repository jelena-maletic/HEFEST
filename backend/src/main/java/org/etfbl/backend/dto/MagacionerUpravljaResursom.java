package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.etfbl.backend.model.MagacionerUpravljaResursomEntity}
 */
@Data
public class MagacionerUpravljaResursom implements Serializable {
    String magacionerJMB;
    Integer idResursa;
}
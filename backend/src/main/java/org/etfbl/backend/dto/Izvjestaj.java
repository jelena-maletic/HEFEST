package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link org.etfbl.backend.model.IzvjestajEntity}
 */
@Data
public class Izvjestaj implements Serializable {
    LocalDate datumKreiranja;
    PoslovodjaUpravljaProjektom poslovodjaUpravljaProjektom;
}
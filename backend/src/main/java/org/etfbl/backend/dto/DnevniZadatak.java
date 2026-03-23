package org.etfbl.backend.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link org.etfbl.backend.model.DnevniZadatakEntity}
 */
@Data
public class DnevniZadatak implements Serializable {
    String opis;
    Boolean zavrsen;
    LocalDate datum;
    DnevniIzvjestaj dnevniIzvjestaj;
    Poslovodja poslovodja;
    Tehnicar tehnicar;
    Integer idDnevnogZadatka;
}
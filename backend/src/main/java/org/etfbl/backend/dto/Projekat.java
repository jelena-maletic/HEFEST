package org.etfbl.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for {@link org.etfbl.backend.model.ProjekatEntity}
 */

@Data
public class Projekat implements Serializable {
    Integer id;
    String opis;
    LocalDate rok;
    String lokacija;
    LocalDate pocetakRada;
    LocalDate krajRada;
    String naziv;
    String status;
    Instant datumKreiranja;
    Instant posljednjaIzmjena;
    String prioritet;
    String klijent;
    String ulogovaniJmb;
    @JsonProperty("projectTeam")
    List<String> timTehnicara;
    @JsonProperty("manager")
    String poslovodja;

    String poslovodjaImePrezime;
}
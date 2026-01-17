package org.etfbl.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for {@link org.etfbl.backend.model.ProjekatEntity}
 */

@Data
public class Projekat implements Serializable {
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

}
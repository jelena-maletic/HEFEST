package org.etfbl.backend.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DnevniZadatakRequest {
    private String opis;
    private String tehnicarJmb;
    private String ulogovaniJmb;
    private LocalDate datum;
}
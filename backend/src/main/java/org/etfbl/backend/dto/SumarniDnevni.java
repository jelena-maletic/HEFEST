package org.etfbl.backend.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class SumarniDnevni implements Serializable{
    Integer idSumarnogIzvjestaja;
    Integer idDnevnogIzvjestaja;
}

package org.etfbl.backend.model.manytomanyid;

import lombok.Data;

import java.io.Serializable;

@Data
public class SumarniDnevniId implements Serializable {
    Integer idSumarnogIzvjestaja;
    Integer idDnevnogIzvjestaja;
}

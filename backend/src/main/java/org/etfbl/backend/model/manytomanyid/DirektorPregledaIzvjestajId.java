package org.etfbl.backend.model.manytomanyid;

import lombok.Data;

import java.io.Serializable;

@Data
public class DirektorPregledaIzvjestajId implements Serializable {
    private String direktorJMB;
    private Integer idIzvjestaja;
}

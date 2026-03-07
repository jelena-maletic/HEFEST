package org.etfbl.backend.model.manytomanyid;

import lombok.Data;

import java.io.Serializable;

@Data
public class TehnicarNaProjektuId implements Serializable {
    private Integer idProjekta;
    private String tehnicarJMB;
}

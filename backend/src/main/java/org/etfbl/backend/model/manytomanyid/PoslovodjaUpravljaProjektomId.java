package org.etfbl.backend.model.manytomanyid;

import lombok.Data;

import java.io.Serializable;

@Data
public class PoslovodjaUpravljaProjektomId implements Serializable {
    private Integer idProjekta;
    private String poslovodjaJMB;
}

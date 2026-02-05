package org.etfbl.backend.model.manytomanyid;

import lombok.Data;

import java.io.Serializable;

@Data
public class ZaduzenjeId implements Serializable {
    private Integer idResursa;
    private String poslovodjaJMB;
}

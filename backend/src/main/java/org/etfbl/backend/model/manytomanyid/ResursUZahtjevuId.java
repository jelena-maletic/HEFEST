package org.etfbl.backend.model.manytomanyid;

import lombok.Data;

import java.io.Serializable;
@Data
public class ResursUZahtjevuId implements Serializable {
    private Integer idZahtjeva;
    private Integer idResursa;
}

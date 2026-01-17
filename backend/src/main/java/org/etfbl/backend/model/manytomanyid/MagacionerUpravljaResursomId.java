package org.etfbl.backend.model.manytomanyid;

import lombok.Data;

import java.io.Serializable;

@Data
public class MagacionerUpravljaResursomId implements Serializable {
    private String magacionerJMB;
    private Integer idResursa;
}
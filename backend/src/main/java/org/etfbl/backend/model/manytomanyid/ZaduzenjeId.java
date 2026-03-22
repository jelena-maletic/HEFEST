package org.etfbl.backend.model.manytomanyid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZaduzenjeId implements Serializable {

    private String poslovodjaJMB;
    private Integer idResursa;

    // Hibernate zahteva equals i hashCode za kompozitne ključeve
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ZaduzenjeId that = (ZaduzenjeId) o;
        return Objects.equals(poslovodjaJMB, that.poslovodjaJMB) &&
                Objects.equals(idResursa, that.idResursa);
    }

    @Override
    public int hashCode() {
        return Objects.hash(poslovodjaJMB, idResursa);
    }
}
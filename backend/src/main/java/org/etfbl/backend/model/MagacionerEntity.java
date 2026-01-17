package org.etfbl.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Magacioner")
public class MagacionerEntity extends ZaposleniEntity {

    public MagacionerEntity() {
        super();
    }
    public MagacionerEntity(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

}


package org.etfbl.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Knjigovodja")
public class KnjigovodjaEntity extends ZaposleniEntity {

    public KnjigovodjaEntity() {
        super();
    }
    public KnjigovodjaEntity(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

}


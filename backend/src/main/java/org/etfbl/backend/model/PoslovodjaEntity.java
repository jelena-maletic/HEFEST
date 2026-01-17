package org.etfbl.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Poslovodja")
public class PoslovodjaEntity extends TehnicarEntity {

    public PoslovodjaEntity() {
        super();
    }
    public PoslovodjaEntity(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

}


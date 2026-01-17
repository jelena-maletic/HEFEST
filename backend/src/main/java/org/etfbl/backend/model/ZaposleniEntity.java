package org.etfbl.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Zaposleni")
public class ZaposleniEntity extends KorisnikEntity {

    public ZaposleniEntity() {
        super();
    }
    public ZaposleniEntity(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

}


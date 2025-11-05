package org.etfbl.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Knjigovodja")
public class Knjigovodja extends Zaposleni {

    public Knjigovodja() {
        super();
    }
    public Knjigovodja(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

}


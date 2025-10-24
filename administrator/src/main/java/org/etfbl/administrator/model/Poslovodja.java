package org.etfbl.administrator.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Poslovodja")
public class Poslovodja extends Tehnicar {

    public Poslovodja() {
        super();
    }
    public Poslovodja (String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

}

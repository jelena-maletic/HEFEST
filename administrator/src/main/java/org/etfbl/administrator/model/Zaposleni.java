package org.etfbl.administrator.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Zaposleni")
public class Zaposleni extends Korisnik {

    public Zaposleni() {
        super();
    }
    public Zaposleni(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

}

package org.etfbl.administrator.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Direktor")
public class Direktor extends Korisnik {

    public Direktor() {
        super();
    }
    public Direktor(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }


}

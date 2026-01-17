package org.etfbl.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Direktor")
public class DirektorEntity extends KorisnikEntity {

    public DirektorEntity() {
        super();
    }
    public DirektorEntity(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }


}

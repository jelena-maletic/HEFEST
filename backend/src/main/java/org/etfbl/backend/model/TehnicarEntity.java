package org.etfbl.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Tehnicar")
public class TehnicarEntity extends ZaposleniEntity {

    @Column(name = "Aktivan")
    private boolean aktivan = false;

    public TehnicarEntity() {
        super();
    }
    public TehnicarEntity(String jmb, String username, String password, String email, String ime, String prezime, String brojTelefona) {
        super(jmb, username, password, email, ime, prezime, brojTelefona);
    }

    public boolean isAktivan() {
        return aktivan;
    }

    public void setAktivan(boolean aktivan) {
        this.aktivan = aktivan;
    }
}
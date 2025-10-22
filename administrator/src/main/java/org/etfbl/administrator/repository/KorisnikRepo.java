package org.etfbl.administrator.repository;

import org.etfbl.administrator.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KorisnikRepo extends JpaRepository<Korisnik, String> {

}
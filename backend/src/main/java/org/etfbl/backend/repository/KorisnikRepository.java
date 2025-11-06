package org.etfbl.backend.repository;

import org.etfbl.backend.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KorisnikRepository extends JpaRepository<Korisnik, String> {
    List<Korisnik> findByUsername(String username);

}

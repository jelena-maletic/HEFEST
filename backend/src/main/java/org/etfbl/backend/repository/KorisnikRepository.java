package org.etfbl.backend.repository;

import org.etfbl.backend.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KorisnikRepository extends JpaRepository<Korisnik, String> {
    Optional<Korisnik> findByUsername(String username);

}

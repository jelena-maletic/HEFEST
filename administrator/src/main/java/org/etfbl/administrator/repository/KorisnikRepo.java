package org.etfbl.administrator.repository;

import org.etfbl.administrator.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface KorisnikRepo extends JpaRepository<Korisnik, String> {
    List<Korisnik> findByImeOrPrezimeOrUsernameContainingIgnoreCase(String ime, String prezime, String username);
    Optional<Korisnik> findByUsername(String username);
}
package org.etfbl.backend.repository;

import org.etfbl.backend.model.KorisnikEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KorisnikRepository extends JpaRepository<KorisnikEntity, String> {
    Optional<KorisnikEntity> findByUsername(String username);

}

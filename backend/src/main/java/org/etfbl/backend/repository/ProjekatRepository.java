package org.etfbl.backend.repository;

import org.etfbl.backend.model.Projekat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjekatRepository extends JpaRepository<Projekat, String> {
}

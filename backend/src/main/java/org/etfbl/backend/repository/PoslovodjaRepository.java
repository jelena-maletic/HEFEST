package org.etfbl.backend.repository;

import org.etfbl.backend.model.PoslovodjaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoslovodjaRepository extends JpaRepository<PoslovodjaEntity, String> {
}

package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniZadatakEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DnevniZadatakRepository extends JpaRepository<DnevniZadatakEntity, Integer> {
}

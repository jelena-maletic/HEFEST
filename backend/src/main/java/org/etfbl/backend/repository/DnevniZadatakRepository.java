package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniZadatakEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DnevniZadatakRepository extends JpaRepository<DnevniZadatakEntity, Integer> {

    List<DnevniZadatakEntity> findAllByPoslovodja_Jmb(String jmb);
}

package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniZadatakEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DnevniZadatakRepository extends JpaRepository<DnevniZadatakEntity, Integer> {

    List<DnevniZadatakEntity> findAllByPoslovodja_Jmb(String jmb);

    List<DnevniZadatakEntity> findAllByTehnicar_JmbAndDatumAndZavrsenTrue(String jmb, LocalDate datum);
}

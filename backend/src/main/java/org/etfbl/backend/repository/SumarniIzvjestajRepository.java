package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniZadatakEntity;
import org.etfbl.backend.model.SumarniIzvjestajEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SumarniIzvjestajRepository extends JpaRepository<SumarniIzvjestajEntity,Integer> {

    List<SumarniIzvjestajEntity> findAllByOrderByDatumKreiranjaDesc();
}

package org.etfbl.backend.repository;

import org.etfbl.backend.model.SumarniDnevniEntity;
import org.etfbl.backend.model.manytomanyid.SumarniDnevniId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SumarniDnevniRepository extends JpaRepository<SumarniDnevniEntity, SumarniDnevniId> {
    List<SumarniDnevniEntity> findAllByIdSumarnogIzvjestaja(Integer idSumarnog);
}

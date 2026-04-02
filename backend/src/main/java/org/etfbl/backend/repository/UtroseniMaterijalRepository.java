package org.etfbl.backend.repository;

import org.etfbl.backend.model.UtroseniMaterijalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UtroseniMaterijalRepository extends JpaRepository<UtroseniMaterijalEntity, Integer> {
    @Query("SELECT u FROM UtroseniMaterijalEntity u WHERE u.dnevniIzvjestaj.id = :id")
    List<UtroseniMaterijalEntity> nadjiSveZaIzvjestaj(@Param("id") Integer id);
}

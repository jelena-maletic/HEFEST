package org.etfbl.backend.repository;

import org.etfbl.backend.model.MagacionerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface MagacionerRepository extends JpaRepository<MagacionerEntity, String> {

    @Query("SELECT m FROM MagacionerEntity m WHERE m.jmb = :jmb")
    Optional<MagacionerEntity> findByJmb(@Param("jmb") String jmb);
}
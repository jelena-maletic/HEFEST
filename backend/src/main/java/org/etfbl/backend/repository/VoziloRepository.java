package org.etfbl.backend.repository;

import org.etfbl.backend.model.VoziloEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoziloRepository extends JpaRepository<VoziloEntity, Integer> {
    Page<VoziloEntity> findAllByObrisanFalse(Pageable pageable);
}
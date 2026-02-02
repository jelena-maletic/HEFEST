package org.etfbl.backend.repository;

import org.etfbl.backend.model.ProjekatEntity;
import org.etfbl.backend.model.RadnaOpremaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RadnaOpremaRepository extends JpaRepository<RadnaOpremaEntity, Integer> {
}



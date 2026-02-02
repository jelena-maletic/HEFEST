package org.etfbl.backend.repository;

import org.etfbl.backend.model.MaterijalEntity;
import org.etfbl.backend.model.ProjekatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MaterijalRepository extends JpaRepository<MaterijalEntity, Integer> {
}

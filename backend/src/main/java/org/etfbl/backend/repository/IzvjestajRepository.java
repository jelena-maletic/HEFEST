package org.etfbl.backend.repository;

import org.etfbl.backend.model.IzvjestajEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IzvjestajRepository extends JpaRepository<IzvjestajEntity,Integer> {
}

package org.etfbl.backend.repository;

import org.etfbl.backend.model.DirektorPregledaIzvjestajEntity;
import org.etfbl.backend.model.manytomanyid.DirektorPregledaIzvjestajId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirektorPregledaIzvjestajRepository extends JpaRepository<DirektorPregledaIzvjestajEntity, DirektorPregledaIzvjestajId> {
}

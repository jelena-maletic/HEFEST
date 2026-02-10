package org.etfbl.backend.repository;

import org.etfbl.backend.dto.TehnicarNaProjektu;
import org.etfbl.backend.model.TehnicarNaProjektuEntity;
import org.etfbl.backend.model.manytomanyid.TehnicarNaProjektuId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TehnicarNaProjektuRepository extends JpaRepository<TehnicarNaProjektuEntity, TehnicarNaProjektuId> {
}

package org.etfbl.backend.repository;

import org.etfbl.backend.model.ResursUZahtjevuEntity;
import org.etfbl.backend.model.manytomanyid.ResursUZahtjevuId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResursUZahtjevuRepository extends CrudRepository<ResursUZahtjevuEntity, ResursUZahtjevuId> {
    List<ResursUZahtjevuEntity> findAllByIdZahtjeva(Integer idZahtjeva);
}

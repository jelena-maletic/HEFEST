package org.etfbl.backend.repository;

import org.etfbl.backend.model.PoslovodjaUpravljaProjektomEntity;
import org.etfbl.backend.model.manytomanyid.PoslovodjaUpravljaProjektomId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PoslovodjaUpravljaProjektomRepository extends JpaRepository<PoslovodjaUpravljaProjektomEntity, PoslovodjaUpravljaProjektomId> {
}

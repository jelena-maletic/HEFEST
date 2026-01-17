package org.etfbl.backend.repository;

import org.etfbl.backend.model.MagacionerUpravljaResursomEntity;
import org.etfbl.backend.model.manytomanyid.MagacionerUpravljaResursomId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MagacionerUpravljaResursomRepository extends JpaRepository<MagacionerUpravljaResursomEntity, MagacionerUpravljaResursomId> {
}

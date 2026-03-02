package org.etfbl.backend.repository;

import org.etfbl.backend.model.ZaduzenjeEntity;
import org.etfbl.backend.model.ZahtjevZaResursimaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZaduzenjeRepository extends JpaRepository<ZaduzenjeEntity, Integer> {
    List<ZaduzenjeEntity> findAllByPoslovodjaJMB(String jmb);
}

package org.etfbl.backend.repository;

import org.etfbl.backend.model.TehnicarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TehnicarRepository extends JpaRepository<TehnicarEntity,String> {
    @Query("SELECT t FROM TehnicarEntity t WHERE TYPE(t) = TehnicarEntity")
    List<TehnicarEntity> findAllOnlyTehnicari();

    @Query("""
        SELECT DISTINCT t
        FROM TehnicarEntity t,
            TehnicarNaProjektuEntity tp,
            PoslovodjaUpravljaProjektomEntity pp
        WHERE t.jmb = tp.tehnicarJMB
            AND tp.idProjekta = pp.idProjekta
            AND pp.poslovodjaJMB = :jmb
        """)
    List<TehnicarEntity> findTehnicariZaPoslovodju(String jmb);
}

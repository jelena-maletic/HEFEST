package org.etfbl.backend.repository;

import org.etfbl.backend.model.PoslovodjaUpravljaProjektomEntity;
import org.etfbl.backend.model.manytomanyid.PoslovodjaUpravljaProjektomId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


public interface PoslovodjaUpravljaProjektomRepository extends JpaRepository<PoslovodjaUpravljaProjektomEntity, PoslovodjaUpravljaProjektomId> {
    @Query("SELECT p.poslovodjaJMB FROM PoslovodjaUpravljaProjektomEntity p WHERE p.idProjekta = :idProjekta")
    String findPoslovodjaJmbByIdProjekta(@Param("idProjekta") Integer idProjekta);


    @Modifying
    @Transactional
    @Query("DELETE FROM PoslovodjaUpravljaProjektomEntity p WHERE p.idProjekta = :idProjekta")
    void deleteByProjekatId(@Param("idProjekta") Integer idProjekta);

    Optional<PoslovodjaUpravljaProjektomEntity> findByProjekat_IdProjektaAndPoslovodja_Jmb(Integer idProjekta, String jmb);
}



package org.etfbl.backend.repository;

import org.etfbl.backend.model.PoslovodjaUpravljaProjektomEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


public interface PoslovodjaUpravljaProjektomRepository extends JpaRepository<PoslovodjaUpravljaProjektomEntity, Integer> {
    @Query("SELECT p.poslovodjaJMB FROM PoslovodjaUpravljaProjektomEntity p " +
            "WHERE p.idProjekta = :idProjekta ORDER BY p.id DESC LIMIT 1")
    String findPoslovodjaJmbByIdProjekta(@Param("idProjekta") Integer idProjekta);


    @Modifying
    @Transactional
    @Query("DELETE FROM PoslovodjaUpravljaProjektomEntity p WHERE p.idProjekta = :idProjekta")
    void deleteByProjekatId(@Param("idProjekta") Integer idProjekta);

    Optional<PoslovodjaUpravljaProjektomEntity> findByProjekat_IdProjektaAndPoslovodja_Jmb(Integer idProjekta, String jmb);

    List<PoslovodjaUpravljaProjektomEntity> findByProjekat_IdProjekta(Integer idProjekta);

    Optional<PoslovodjaUpravljaProjektomEntity> findFirstByProjekat_IdProjektaAndPoslovodja_JmbOrderByIdDesc(Integer idProjekta, String jmb);

    Optional<PoslovodjaUpravljaProjektomEntity> findFirstByProjekat_IdProjektaOrderByIdDesc(Integer idProjekta);
}



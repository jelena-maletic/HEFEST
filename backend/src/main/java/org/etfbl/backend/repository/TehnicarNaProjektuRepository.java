package org.etfbl.backend.repository;

import org.etfbl.backend.model.TehnicarNaProjektuEntity;
import org.etfbl.backend.model.manytomanyid.TehnicarNaProjektuId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TehnicarNaProjektuRepository extends JpaRepository<TehnicarNaProjektuEntity, TehnicarNaProjektuId> {

    @Query("SELECT t.tehnicarJMB FROM TehnicarNaProjektuEntity t WHERE t.idProjekta = :idProjekta")
    List<String> findTehnicarJMBByIdProjekta(@Param("idProjekta") Integer idProjekta);


    @Modifying
    @Transactional
    @Query("DELETE FROM TehnicarNaProjektuEntity t WHERE t.idProjekta = :idProjekta")
    void deleteByProjekatId(@Param("idProjekta") Integer idProjekta);
}

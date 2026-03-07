package org.etfbl.backend.repository;

import org.etfbl.backend.model.TehnicarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TehnicarRepository extends JpaRepository<TehnicarEntity,String> {
    @Query("SELECT t FROM TehnicarEntity t WHERE TYPE(t) = TehnicarEntity")
    List<TehnicarEntity> findAllOnlyTehnicari();

}

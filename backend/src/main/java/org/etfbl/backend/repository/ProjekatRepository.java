package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniZadatakEntity;
import org.etfbl.backend.model.ProjekatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjekatRepository extends JpaRepository<ProjekatEntity, Integer> {

    List<ProjekatEntity> findAllByLokacijaContainingIgnoreCaseAndObrisanFalse(String lokacija);

    List<ProjekatEntity> findAllByOrderByDatumKreiranjaDesc();

    @Query("SELECT DISTINCT p.lokacija FROM ProjekatEntity p WHERE p.obrisan = false")
    List<String> findUniqueActiveLocations();

    @Query("SELECT p FROM ProjekatEntity p JOIN p.tehnicari t WHERE t.jmb = :jmb")
    List<ProjekatEntity> findAllByTehnicarJmb(String jmb);

    @Query("SELECT p FROM ProjekatEntity p JOIN p.poslovodje pos WHERE pos.jmb = :jmb")
    List<ProjekatEntity> findAllByPoslovodjaJmb(String jmb);
}

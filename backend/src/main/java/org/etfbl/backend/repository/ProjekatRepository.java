package org.etfbl.backend.repository;

import org.etfbl.backend.model.ProjekatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjekatRepository extends JpaRepository<ProjekatEntity, Integer> {

    List<ProjekatEntity> findAllByLokacijaContainingIgnoreCaseAndObrisanFalse(String lokacija);


    @Query("SELECT DISTINCT p.lokacija FROM ProjekatEntity p WHERE p.obrisan = false")
    List<String> findUniqueActiveLocations();


    //TODO Uraditi filter po: nazivu, klijentu, prioritetu, statusu, po godini (rok ili kraj ili pocetak - RAZMISLI), po godini i mjesecu
}

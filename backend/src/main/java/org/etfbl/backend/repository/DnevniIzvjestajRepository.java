package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniIzvjestajEntity;
import org.etfbl.backend.model.DnevniZadatakEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DnevniIzvjestajRepository extends JpaRepository<DnevniIzvjestajEntity,Integer> {

    List<DnevniIzvjestajEntity> findAllByOrderByDatumDesc();

    List<DnevniIzvjestajEntity> findAllByPoslovodjaUpravljaProjektom_Projekat_IdProjektaAndDatumBetween(
            Integer idProjekta, LocalDate od, LocalDate doDatuma);
}

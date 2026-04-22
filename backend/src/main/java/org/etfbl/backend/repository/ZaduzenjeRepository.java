package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniZadatakEntity;
import org.etfbl.backend.model.ZaduzenjeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZaduzenjeRepository extends JpaRepository<ZaduzenjeEntity, Integer> {

    List<ZaduzenjeEntity> findAllByOrderByDatumZaduzenjaDesc();

    List<ZaduzenjeEntity> findAllByPoslovodjaJmb(String jmb);

    List<ZaduzenjeEntity> findAllByMagacionerJmb(String jmb);

    boolean existsByResurs_Id(Integer resursId);

    //List<ZaduzenjeEntity> findAllByZahtjev_IdZahtjeva(String idZahtjeva);
}

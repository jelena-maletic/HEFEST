package org.etfbl.backend.repository;

import org.etfbl.backend.model.DnevniZadatakEntity;
import org.etfbl.backend.model.StanjeZahtjeva;
import org.etfbl.backend.model.ZaduzenjeEntity;
import org.etfbl.backend.model.ZahtjevZaResursimaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.authentication.jaas.JaasPasswordCallbackHandler;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZahtjevZaResursimaRepository extends JpaRepository<ZahtjevZaResursimaEntity,Integer> {

   // @Query("SELECT z FROM ZahtjevZaResursimaEntity z LEFT JOIN FETCH z.resursUZahtjevu WHERE z.id = :id")
    //Optional<ZahtjevZaResursimaEntity> findByIdWithResources(Integer id);

    List<ZahtjevZaResursimaEntity> findAllByOrderByDatumSlanjaDesc();
    List<ZahtjevZaResursimaEntity> findAllByStanjeZahtjeva(StanjeZahtjeva stanje);
    List<ZahtjevZaResursimaEntity> findAllByPoslovodja_jmb(String jmb);

    boolean existsByResurs_Id(Integer resursId);
}

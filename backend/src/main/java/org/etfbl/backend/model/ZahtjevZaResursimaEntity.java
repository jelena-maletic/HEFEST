package org.etfbl.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Entity
@Table(name="Zahtjev_Za_Resursima")
public class ZahtjevZaResursimaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdZahtjeva", nullable = false)
    private Integer id;

    @Column(name = "DatumSlanja", nullable = false)
    private Instant datumSlanja;

    @Column(name = "DatumObrade")
    private Instant datumObrade;

    @Column(name = "Opis", nullable = false)
    private String opis;

    @Enumerated(EnumType.STRING)
    @Column(name = "StanjeZahtjeva", nullable = false)
    private StanjeZahtjeva stanjeZahtjeva=StanjeZahtjeva.neobradjen;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Poslovodja_JMB", nullable = false)
    private PoslovodjaEntity poslovodja;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "Magacioner_JMB", nullable = false)
    private MagacionerEntity magacioner;

   /* @OneToMany(mappedBy = "zahtjev")
    private Set<ResursUZahtjevuEntity> resursUZahtjevu = new LinkedHashSet<>();
    //prilikom ucitavanja zahtjeva se mogu ucitati i svi resursi koji su trazeni u zahtjevu*/
}

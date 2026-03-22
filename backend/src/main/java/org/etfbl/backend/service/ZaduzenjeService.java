package org.etfbl.backend.service;

import org.etfbl.backend.dto.Zaduzenje;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.model.ZaduzenjeEntity;
import org.etfbl.backend.model.PoslovodjaEntity;
import org.etfbl.backend.model.ResursEntity;
import org.etfbl.backend.repository.ZaduzenjeRepository;
import org.etfbl.backend.repository.PoslovodjaRepository;
import org.etfbl.backend.repository.ResursRepository;
import org.etfbl.backend.model.manytomanyid.ZaduzenjeId;
import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.math.BigDecimal;
import java.time.Instant;

@Transactional
@Service
public class ZaduzenjeService {

    private final ZaduzenjeRepository zaduzenjeRepository;
    private final ModelMapper modelMapper;
    private final PoslovodjaRepository poslovodjaRepository;
    private final ResursRepository resursRepository;

    public ZaduzenjeService(ZaduzenjeRepository zaduzenjeRepository, ModelMapper modelMapper,
                            PoslovodjaRepository poslovodjaRepository, ResursRepository resursRepository) {
        this.zaduzenjeRepository = zaduzenjeRepository;
        this.modelMapper = modelMapper;
        this.poslovodjaRepository = poslovodjaRepository;
        this.resursRepository = resursRepository;
    }

    // Pomoćna metoda za određivanje tipa resursa (da ne ponavljamo kod)
    private String resolveResourceType(ResursEntity resurs) {
        if (resurs == null) return "MATERIJAL";

        // Hibernate.getClass() osigurava da dobijemo pravu klasu, a ne Proxy
        String className = Hibernate.getClass(resurs).getSimpleName();

        if (className.contains("Vozilo")) return "VOZILO";
        if (className.contains("RadnaOprema")) return "OPREMA";
        return "MATERIJAL";
    }

    public List<Zaduzenje> getAllZaduzenje() {
        return zaduzenjeRepository.findAll().stream()
                .map(entity -> {
                    Zaduzenje dto = modelMapper.map(entity, Zaduzenje.class);
                    dto.setManager(entity.getPoslovodjaJMB());
                    dto.setResursId(entity.getIdResursa());

                    if (entity.getResurs() != null) {
                        dto.setResursNaziv(entity.getResurs().getNaziv());
                        dto.setResourceType(resolveResourceType(entity.getResurs()));
                    }

                    if (entity.getPoslovodja() != null) {
                        dto.setPoslovodjaImePrezime(entity.getPoslovodja().getIme() + " " + entity.getPoslovodja().getPrezime());
                    }
                    return dto;
                }).toList();
    }

    public Zaduzenje sacuvajZaduzenje(Zaduzenje dto) {
        ZaduzenjeEntity entity = new ZaduzenjeEntity();
        entity.setPoslovodjaJMB(dto.getManager());
        entity.setIdResursa(dto.getResursId());

        PoslovodjaEntity poslovodja = poslovodjaRepository.findById(dto.getManager())
                .orElseThrow(() -> new RuntimeException("Poslovođa nije pronađen"));
        ResursEntity resurs = resursRepository.findById(dto.getResursId())
                .orElseThrow(() -> new RuntimeException("Resurs nije pronađen"));

        entity.setPoslovodja(poslovodja);
        entity.setResurs(resurs);
        entity.setDatumZaduzenja(dto.getDatumZaduzenja() != null ? dto.getDatumZaduzenja() : Instant.now());
        entity.setZaduzenaKolicina(dto.getZaduzenaKolicina());
        entity.setRazduzenaKolicina(dto.getRazduzenaKolicina() != null ? dto.getRazduzenaKolicina() : BigDecimal.ZERO);

        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(entity);

        Zaduzenje rezultat = modelMapper.map(sacuvan, Zaduzenje.class);
        rezultat.setManager(sacuvan.getPoslovodjaJMB());
        rezultat.setResursId(sacuvan.getIdResursa());
        rezultat.setResursNaziv(resurs.getNaziv());
        rezultat.setResourceType(resolveResourceType(resurs));
        rezultat.setPoslovodjaImePrezime(poslovodja.getIme() + " " + poslovodja.getPrezime());

        return rezultat;
    }

    public Zaduzenje updateZaduzenje(String jmb, Integer resursId, Zaduzenje dto) throws NotFoundException {
        ZaduzenjeId id = new ZaduzenjeId(jmb, resursId);

        ZaduzenjeEntity postojeci = zaduzenjeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Zaduženje nije pronađeno."));

        postojeci.setZaduzenaKolicina(dto.getZaduzenaKolicina());
        postojeci.setRazduzenaKolicina(dto.getRazduzenaKolicina() != null ? dto.getRazduzenaKolicina() : BigDecimal.ZERO);
        postojeci.setDatumZaduzenja(dto.getDatumZaduzenja());
        postojeci.setDatumRazduzenja(dto.getDatumRazduzenja());

        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(postojeci);

        Zaduzenje rezultat = modelMapper.map(sacuvan, Zaduzenje.class);
        rezultat.setManager(jmb);
        rezultat.setResursId(resursId);

        if (sacuvan.getResurs() != null) {
            rezultat.setResourceType(resolveResourceType(sacuvan.getResurs()));
            rezultat.setResursNaziv(sacuvan.getResurs().getNaziv());
        }

        return rezultat;
    }

    public void obrisiZaduzenje(String jmb, Integer resursId) {
        ZaduzenjeId id = new ZaduzenjeId(jmb, resursId);
        if (!zaduzenjeRepository.existsById(id)) {
            throw new RuntimeException("Zaduženje ne postoji.");
        }
        zaduzenjeRepository.deleteById(id);
    }
}
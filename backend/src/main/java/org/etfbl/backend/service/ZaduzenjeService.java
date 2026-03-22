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

    public List<Zaduzenje> getAllZaduzenje() {
        return zaduzenjeRepository.findAll().stream()
                .map(entity -> {
                    Zaduzenje dto = modelMapper.map(entity, Zaduzenje.class);
                    // Mapiranje dodatnih polja za prikaz na frontendu
                    dto.setManager(entity.getPoslovodjaJMB());
                    dto.setResursId(entity.getIdResursa());
                    if (entity.getResurs() != null) {
                        dto.setResursNaziv(entity.getResurs().getNaziv());
                    }
                    if (entity.getPoslovodja() != null) {
                        dto.setPoslovodjaImePrezime(entity.getPoslovodja().getIme() + " " + entity.getPoslovodja().getPrezime());
                    }
                    return dto;
                }).toList();
    }

    public Zaduzenje sacuvajZaduzenje(Zaduzenje dto) {
        ZaduzenjeEntity entity = new ZaduzenjeEntity();

        // 1. Postavljanje stranih ključeva (ID polja)
        entity.setPoslovodjaJMB(dto.getManager());
        entity.setIdResursa(dto.getResursId());

        // 2. Pronalaženje cijelih entiteta (potrebno za relacije/mapiranje)
        PoslovodjaEntity poslovodja = poslovodjaRepository.findById(dto.getManager())
                .orElseThrow(() -> new RuntimeException("Poslovođa nije pronađen"));
        ResursEntity resurs = resursRepository.findById(dto.getResursId())
                .orElseThrow(() -> new RuntimeException("Resurs nije pronađen"));

        entity.setPoslovodja(poslovodja);
        entity.setResurs(resurs);

        // 3. Rukovanje datumom zaduženja
        if (dto.getDatumZaduzenja() != null) {
            entity.setDatumZaduzenja(dto.getDatumZaduzenja());
        } else {
            entity.setDatumZaduzenja(Instant.now());
        }

        // 4. Rukovanje količinama (Rješava tvoj DataIntegrityViolationException)
        entity.setZaduzenaKolicina(dto.getZaduzenaKolicina());

        if (dto.getRazduzenaKolicina() != null) {
            entity.setRazduzenaKolicina(dto.getRazduzenaKolicina());
        } else {
            // Novo zaduženje u startu ima 0 razduženo (ovo rješava problem sa null u bazi)
            entity.setRazduzenaKolicina(BigDecimal.ZERO);
        }

        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(entity);

        // Vraćamo DTO nazad (ovdje ponavljamo logiku mapiranja kao u getAll)
        Zaduzenje rezultat = modelMapper.map(sacuvan, Zaduzenje.class);
        rezultat.setManager(sacuvan.getPoslovodjaJMB());
        rezultat.setResursId(sacuvan.getIdResursa());
        return rezultat;
    }

    public void obrisiZaduzenje(String jmb, Integer resursId) {
        ZaduzenjeId id = new ZaduzenjeId();
        id.setPoslovodjaJMB(jmb);
        id.setIdResursa(resursId);

        if (!zaduzenjeRepository.existsById(id)) {
            throw new RuntimeException("Zaduženje ne postoji.");
        }
        zaduzenjeRepository.deleteById(id);
    }

    public Zaduzenje updateZaduzenje(String jmb, Integer resursId, Zaduzenje dto) throws NotFoundException {
        ZaduzenjeId id = new ZaduzenjeId(jmb, resursId); // Koristi konstruktor ako ga imaš

        ZaduzenjeEntity postojeci = zaduzenjeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Zaduženje nije pronađeno."));

        // Ažuriraj polja
        postojeci.setZaduzenaKolicina(dto.getZaduzenaKolicina());
        postojeci.setRazduzenaKolicina(dto.getRazduzenaKolicina() != null ? dto.getRazduzenaKolicina() : BigDecimal.ZERO);
        postojeci.setDatumZaduzenja(dto.getDatumZaduzenja());
        postojeci.setDatumRazduzenja(dto.getDatumRazduzenja());

        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(postojeci);

        // Vrati mapiran DTO da frontend odmah vidi promjenu
        Zaduzenje rezultat = modelMapper.map(sacuvan, Zaduzenje.class);
        rezultat.setManager(jmb);
        rezultat.setResursId(resursId);
        return rezultat;
    }
}
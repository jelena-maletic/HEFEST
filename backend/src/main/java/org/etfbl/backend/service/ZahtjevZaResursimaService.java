package org.etfbl.backend.service;


import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.ResursUZahtjevu;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.dto.ZahtjevZaResursima;
import org.etfbl.backend.model.*;
import org.etfbl.backend.repository.MagacionerRepository;
import org.etfbl.backend.repository.PoslovodjaRepository;
import org.etfbl.backend.repository.ZahtjevZaResursimaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Transactional
@Service
public class ZahtjevZaResursimaService {

    private final ZahtjevZaResursimaRepository zahtjevZaResursimaRepository;
    private final ModelMapper modelMapper;
    private final PoslovodjaRepository poslovodjaRepository;
    private final MagacionerRepository magacionerRepository;

    public ZahtjevZaResursimaService(ZahtjevZaResursimaRepository zahtjevZaResursimaRepository, ModelMapper modelMapper, PoslovodjaRepository poslovodjaRepository, MagacionerRepository magacionerRepository) {
        this.zahtjevZaResursimaRepository = zahtjevZaResursimaRepository;
        this.modelMapper = modelMapper;
        this.poslovodjaRepository = poslovodjaRepository;
        this.magacionerRepository = magacionerRepository;
    }

    public List<ZahtjevZaResursima> getAllZahtjevi() {

        return zahtjevZaResursimaRepository.findAll().stream().map(z -> modelMapper.map(z, ZahtjevZaResursima.class )).toList();
    }

    public ZahtjevZaResursima sacuvajZahtjev(ZahtjevZaResursima dto) {
        ZahtjevZaResursimaEntity entity=modelMapper.map(dto, ZahtjevZaResursimaEntity.class);

        Instant sada = Instant.now();
        entity.setDatumSlanja(sada);

        PoslovodjaEntity poslovodja = poslovodjaRepository.findById("1308001123123")
                .orElseThrow(() -> new RuntimeException("Poslovodja ne postoji"));

        MagacionerEntity magacioner = magacionerRepository.findById("1234567899999")
                .orElseThrow(() -> new RuntimeException("Magacioner ne postoji"));
        entity.setPoslovodja(poslovodja);
        entity.setMagacioner(magacioner);
        ZahtjevZaResursimaEntity sacuvan = zahtjevZaResursimaRepository.save(entity);
        return modelMapper.map(sacuvan, ZahtjevZaResursima.class);
    }
}

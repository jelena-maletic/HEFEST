package org.etfbl.backend.service;


import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.*;
import org.etfbl.backend.exceptions.NotFoundException;
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

    public ZahtjevZaResursima getZahtjevById(Integer id) throws NotFoundException {
        ZahtjevZaResursimaEntity entity = zahtjevZaResursimaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Zahtjev sa ID-om " + id + " nije pronađen."));

        return modelMapper.map(entity, ZahtjevZaResursima.class);
    }

    public ZahtjevZaResursima sacuvajZahtjev(ZahtjevZaResursima dto) {
        ZahtjevZaResursimaEntity entity = new ZahtjevZaResursimaEntity();

        entity.setOpis(dto.getOpis());
        entity.setDatumSlanja(Instant.now());
        entity.setStanjeZahtjeva(StanjeZahtjeva.neobradjen);

        if (dto.getPoslovodja() == null || dto.getPoslovodja().getJmb() == null) {
            throw new RuntimeException("JMB poslovođe mora biti proslijeđen!");
        }
        String jmbPoslovodje = dto.getPoslovodja().getJmb();

        if (dto.getMagacioner() == null || dto.getMagacioner().getJmb() == null) {
            throw new RuntimeException("JMB magacionera mora biti proslijeđen!");
        }
        String jmbMagacionera = dto.getMagacioner().getJmb();

        PoslovodjaEntity poslovodja = poslovodjaRepository.findById(jmbPoslovodje)
                .orElseThrow(() -> new RuntimeException("Poslovođa sa JMB " + jmbPoslovodje + " ne postoji u bazi"));

        MagacionerEntity magacioner = magacionerRepository.findById(jmbMagacionera)
                .orElseThrow(() -> new RuntimeException("Magacioner sa JMB " + jmbMagacionera + " ne postoji u bazi"));

        entity.setPoslovodja(poslovodja);
        entity.setMagacioner(magacioner);

        ZahtjevZaResursimaEntity sacuvan = zahtjevZaResursimaRepository.save(entity);
        return modelMapper.map(sacuvan, ZahtjevZaResursima.class);
    }

    public List<ZahtjevZaResursima> getZahtjeviByPoslovodjaId(String poslovodjaId) throws NotFoundException {

        List<ZahtjevZaResursimaEntity> entiteti = zahtjevZaResursimaRepository.findAllByPoslovodja_jmb(poslovodjaId);

        if (entiteti.isEmpty()) {
            throw new NotFoundException("Nisu pronađeni zahtjevi za poslovođu sa JMB: " + poslovodjaId);
        }

        return entiteti.stream()
                .map(z -> modelMapper.map(z, ZahtjevZaResursima.class))
                .toList();
    }

    public ZahtjevZaResursima updateStanje(Integer id, StanjeZahtjeva stanjeZahtjeva) {
        ZahtjevZaResursimaEntity entity = zahtjevZaResursimaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zahtjev nije pronađen"));

        entity.setStanjeZahtjeva(stanjeZahtjeva);
        entity.setDatumObrade(Instant.now()); // Sets the processing time to 'now'

        // Use saveAndFlush to catch database errors immediately during the call
        ZahtjevZaResursimaEntity updated = zahtjevZaResursimaRepository.saveAndFlush(entity);

        return modelMapper.map(updated, ZahtjevZaResursima.class);
    }

    public void obrisiZahtjev(Integer id) {
        if (!zahtjevZaResursimaRepository.existsById(id)) {
            throw new RuntimeException("Zahtjev sa ID-om " + id + " ne postoji.");
        }
        zahtjevZaResursimaRepository.deleteById(id);
    }

    public ZahtjevZaResursima updateZahtjev(Integer id, ZahtjevZaResursima dto) throws NotFoundException {
        ZahtjevZaResursimaEntity postojeci = zahtjevZaResursimaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Zahtjev ne postoji."));

        // Poslovodja može mijenjati samo opis dok je zahtjev 'neobradjen'
        if (postojeci.getStanjeZahtjeva() == StanjeZahtjeva.neobradjen) {
            postojeci.setOpis(dto.getOpis());
        }

        // Ako magacioner odobrava/odbija (ovo će ti trebati kasnije)
        if (dto.getStanjeZahtjeva() != null) {
            postojeci.setStanjeZahtjeva(dto.getStanjeZahtjeva());
            postojeci.setDatumObrade(Instant.now());
        }

        ZahtjevZaResursimaEntity sacuvan = zahtjevZaResursimaRepository.save(postojeci);
        return modelMapper.map(sacuvan, ZahtjevZaResursima.class);
    }
}

package org.etfbl.backend.service;


import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.*;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.model.*;
import org.etfbl.backend.repository.MagacionerRepository;
import org.etfbl.backend.repository.PoslovodjaRepository;
import org.etfbl.backend.repository.ResursRepository;
import org.etfbl.backend.repository.ZahtjevZaResursimaRepository;
import org.hibernate.Hibernate;
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
    private final ResursRepository resursRepository;

    public ZahtjevZaResursimaService(ZahtjevZaResursimaRepository zahtjevZaResursimaRepository, ModelMapper modelMapper, PoslovodjaRepository poslovodjaRepository, MagacionerRepository magacionerRepository, ResursRepository resursRepository) {
        this.zahtjevZaResursimaRepository = zahtjevZaResursimaRepository;
        this.modelMapper = modelMapper;
        this.poslovodjaRepository = poslovodjaRepository;
        this.magacionerRepository = magacionerRepository;
        this.resursRepository = resursRepository;
    }

    public List<ZahtjevZaResursima> getAllZahtjevi() {
        return zahtjevZaResursimaRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    private String resolveResourceType(ResursEntity resurs) {
        if (resurs == null) return "MATERIJAL";
        String className = Hibernate.getClass(resurs).getSimpleName();
        if (className.contains("Vozilo")) return "VOZILO";
        if (className.contains("RadnaOprema")) return "OPREMA";
        return "MATERIJAL";
    }

    private ZahtjevZaResursima convertToDto(ZahtjevZaResursimaEntity entity) {
        ZahtjevZaResursima dto = modelMapper.map(entity, ZahtjevZaResursima.class);

        dto.setPoslovodjaJMB(entity.getPoslovodja().getJmb());
        dto.setPoslovodjaImePrezime(entity.getPoslovodja().getIme() + " " + entity.getPoslovodja().getPrezime());

        dto.setMagacionerJMB(entity.getMagacioner().getJmb());
        dto.setMagacionerImePrezime(entity.getMagacioner().getIme() + " " + entity.getMagacioner().getPrezime());

        dto.setResursId(entity.getResurs().getId());
        dto.setResursNaziv(entity.getResurs().getNaziv());
        dto.setResourceType(resolveResourceType(entity.getResurs()));

        return dto;
    }

    public ZahtjevZaResursima getZahtjevById(Integer id) throws NotFoundException {
        ZahtjevZaResursimaEntity entity = zahtjevZaResursimaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Zahtjev sa ID-om " + id + " nije pronađen."));
        return convertToDto(entity);
    }

    public ZahtjevZaResursima sacuvajZahtjev(ZahtjevZaResursima dto) {
        ZahtjevZaResursimaEntity entity = new ZahtjevZaResursimaEntity();

        PoslovodjaEntity poslovodja = poslovodjaRepository.findById(dto.getPoslovodjaJMB())
                .orElseThrow(() -> new RuntimeException("Poslovođa nije pronađen"));

        MagacionerEntity magacioner = magacionerRepository.findById(dto.getMagacionerJMB())
                .orElseThrow(() -> new RuntimeException("Magacioner nije pronađen"));

        ResursEntity resurs = resursRepository.findById(dto.getResursId())
                .orElseThrow(() -> new RuntimeException("Resurs nije pronađen"));

        entity.setPoslovodja(poslovodja);
        entity.setMagacioner(magacioner);
        entity.setResurs(resurs);
        entity.setKolicina(dto.getKolicina());
        entity.setOpis(dto.getOpis());
        entity.setDatumSlanja(Instant.now());
        entity.setStanjeZahtjeva(StanjeZahtjeva.neobradjen);

        ZahtjevZaResursimaEntity sacuvan = zahtjevZaResursimaRepository.save(entity);
        return convertToDto(sacuvan);
    }

    public List<ZahtjevZaResursima> getZahtjeviByPoslovodjaId(String jmb) {
        return zahtjevZaResursimaRepository.findAllByPoslovodja_jmb(jmb).stream()
                .map(this::convertToDto)
                .toList();
    }

    public ZahtjevZaResursima updateStanje(Integer id, StanjeZahtjeva novoStanje) {
        ZahtjevZaResursimaEntity entity = zahtjevZaResursimaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zahtjev nije pronađen"));

        entity.setStanjeZahtjeva(novoStanje);
        entity.setDatumObrade(Instant.now());

        return convertToDto(zahtjevZaResursimaRepository.save(entity));
    }

    public void obrisiZahtjev(Integer id) {
        if (!zahtjevZaResursimaRepository.existsById(id)) {
            throw new RuntimeException("Zahtjev ne postoji.");
        }
        zahtjevZaResursimaRepository.deleteById(id);
    }

    public ZahtjevZaResursima updateZahtjev(Integer id, ZahtjevZaResursima dto) throws NotFoundException {
        ZahtjevZaResursimaEntity postojeci = zahtjevZaResursimaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Zahtjev ne postoji."));

        if (postojeci.getStanjeZahtjeva() == StanjeZahtjeva.neobradjen) {
            postojeci.setOpis(dto.getOpis());
            postojeci.setKolicina(dto.getKolicina());

            if (dto.getResursId() != null) {
                ResursEntity noviResurs = resursRepository.findById(dto.getResursId())
                        .orElseThrow(() -> new RuntimeException("Resurs nije pronađen"));
                postojeci.setResurs(noviResurs);
            }
        }

        return convertToDto(zahtjevZaResursimaRepository.save(postojeci));
    }
}

package org.etfbl.backend.service;

import org.etfbl.backend.dto.Zaduzenje;
import org.etfbl.backend.exceptions.NotFoundException;
import org.etfbl.backend.model.MagacionerEntity;
import org.etfbl.backend.model.ZaduzenjeEntity;
import org.etfbl.backend.model.PoslovodjaEntity;
import org.etfbl.backend.model.ResursEntity;
import org.etfbl.backend.repository.*;
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
    private final MagacionerRepository magacionerRepository;
    private final ZahtjevZaResursimaRepository zahtjevRepository;

    public ZaduzenjeService(ZaduzenjeRepository zaduzenjeRepository, ModelMapper modelMapper,
                            PoslovodjaRepository poslovodjaRepository, ResursRepository resursRepository, MagacionerRepository magacionerRepository, ZahtjevZaResursimaRepository zahtjevRepository) {
        this.zaduzenjeRepository = zaduzenjeRepository;
        this.modelMapper = modelMapper;
        this.poslovodjaRepository = poslovodjaRepository;
        this.resursRepository = resursRepository;
        this.magacionerRepository = magacionerRepository;
        this.zahtjevRepository = zahtjevRepository;
    }

    private String resolveResourceType(ResursEntity resurs) {
        if (resurs == null) return "MATERIJAL";
        String className = Hibernate.getClass(resurs).getSimpleName();
        if (className.contains("Vozilo")) return "VOZILO";
        if (className.contains("RadnaOprema")) return "OPREMA";
        return "MATERIJAL";
    }

    public List<Zaduzenje> getAllZaduzenje() {
        return zaduzenjeRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    private Zaduzenje convertToDto(ZaduzenjeEntity entity) {
        Zaduzenje dto = modelMapper.map(entity, Zaduzenje.class);

        dto.setIdZaduzenja(entity.getIdZaduzenja());
        dto.setResursId(entity.getResurs().getId());
        dto.setResursNaziv(entity.getResurs().getNaziv());

        dto.setPoslovodjaJMB(entity.getPoslovodja().getJmb());
        dto.setPoslovodjaImePrezime(entity.getPoslovodja().getIme() + " " + entity.getPoslovodja().getPrezime());

        dto.setMagacionerJMB(entity.getMagacioner().getJmb());
        dto.setMagacionerImePrezime(entity.getMagacioner().getIme() + " " + entity.getMagacioner().getPrezime());

        if (entity.getZahtjev() != null) {
            dto.setIdZahtjeva(entity.getZahtjev().getId());
            dto.setOpisZahtjeva(entity.getZahtjev().getOpis());
        }

        return dto;
    }

    public Zaduzenje sacuvajZaduzenje(Zaduzenje dto) {
        ZaduzenjeEntity entity = new ZaduzenjeEntity();

        PoslovodjaEntity poslovodja = poslovodjaRepository.findById(dto.getPoslovodjaJMB())
                .orElseThrow(() -> new RuntimeException("Greška: Poslovođa sa JMB " + dto.getPoslovodjaJMB() + " nije pronađen."));

        MagacionerEntity magacioner = magacionerRepository.findById(dto.getMagacionerJMB())
                .orElseThrow(() -> new RuntimeException("Greška: Magacioner sa JMB " + dto.getMagacionerJMB() + " nije pronađen."));

        ResursEntity resurs = resursRepository.findById(dto.getResursId())
                .orElseThrow(() -> new RuntimeException("Greška: Resurs sa ID " + dto.getResursId() + " nije pronađen."));

        entity.setPoslovodja(poslovodja);
        entity.setMagacioner(magacioner);
        entity.setResurs(resurs);

        if (dto.getIdZahtjeva() != null) {
            Integer zahtjevId = dto.getIdZahtjeva();

            zahtjevRepository.findById(zahtjevId).ifPresent(entity::setZahtjev);
        }

        entity.setDatumZaduzenja(dto.getDatumZaduzenja() != null ? dto.getDatumZaduzenja() : Instant.now());
        entity.setZaduzenaKolicina(dto.getZaduzenaKolicina());

        entity.setRazduzenaKolicina(dto.getRazduzenaKolicina() != null ? dto.getRazduzenaKolicina() : BigDecimal.ZERO);
        entity.setDatumRazduzenja(dto.getDatumRazduzenja());

        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(entity);

        return convertToDto(sacuvan);
    }

    public Zaduzenje updateZaduzenje(Integer idZaduzenja, Zaduzenje dto) throws NotFoundException {
        ZaduzenjeEntity postojeci = zaduzenjeRepository.findById(idZaduzenja)
                .orElseThrow(() -> new NotFoundException("Zaduženje sa ID-om " + idZaduzenja + " nije pronađeno."));
        postojeci.setZaduzenaKolicina(dto.getZaduzenaKolicina());
        postojeci.setRazduzenaKolicina(dto.getRazduzenaKolicina() != null ? dto.getRazduzenaKolicina() : BigDecimal.ZERO);
        postojeci.setDatumZaduzenja(dto.getDatumZaduzenja());
        postojeci.setDatumRazduzenja(dto.getDatumRazduzenja());
        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(postojeci);
        return convertToDto(sacuvan);
    }

    public void obrisiZaduzenje(Integer idZaduzenja) {
        if (!zaduzenjeRepository.existsById(idZaduzenja)) {
            throw new RuntimeException("Nemoguće obrisati. Zaduženje sa ID-om " + idZaduzenja + " ne postoji.");
        }
        zaduzenjeRepository.deleteById(idZaduzenja);
    }
}
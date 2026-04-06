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

        dto.setResourceType(resolveResourceType(entity.getResurs()));

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
                .orElseThrow(() -> new RuntimeException("Poslovođa nije pronađen."));

        MagacionerEntity magacioner = magacionerRepository.findById(dto.getMagacionerJMB())
                .orElseThrow(() -> new RuntimeException("Magacioner nije pronađen."));

        ResursEntity resurs = resursRepository.findById(dto.getResursId())
                .orElseThrow(() -> new RuntimeException("Resurs nije pronađen."));

        BigDecimal zaduzeno = dto.getZaduzenaKolicina() != null ? dto.getZaduzenaKolicina() : BigDecimal.ZERO;
        BigDecimal razduzeno = dto.getRazduzenaKolicina() != null ? dto.getRazduzenaKolicina() : BigDecimal.ZERO;
        BigDecimal netoIzlaz = zaduzeno.subtract(razduzeno);

        if (netoIzlaz.compareTo(BigDecimal.ZERO) > 0) {
            if (resurs.getStanjeMagacina().compareTo(netoIzlaz) < 0) {
                throw new RuntimeException("Nedovoljno na stanju! Pokušavate zadužiti (neto): " + netoIzlaz + ", a dostupno je: " + resurs.getStanjeMagacina());
            }
        }

        resurs.setStanjeMagacina(resurs.getStanjeMagacina().subtract(netoIzlaz));
        resursRepository.save(resurs);

        entity.setPoslovodja(poslovodja);
        entity.setMagacioner(magacioner);
        entity.setResurs(resurs);
        entity.setZaduzenaKolicina(zaduzeno);
        entity.setRazduzenaKolicina(razduzeno);
        entity.setDatumZaduzenja(dto.getDatumZaduzenja() != null ? dto.getDatumZaduzenja() : Instant.now());
        entity.setDatumRazduzenja(dto.getDatumRazduzenja());

        if (dto.getIdZahtjeva() != null) {
            zahtjevRepository.findById(dto.getIdZahtjeva()).ifPresent(entity::setZahtjev);
        }

        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(entity);
        return convertToDto(sacuvan);
    }

    public Zaduzenje updateZaduzenje(Integer idZaduzenja, Zaduzenje dto) throws NotFoundException {
        ZaduzenjeEntity postojeci = zaduzenjeRepository.findById(idZaduzenja)
                .orElseThrow(() -> new NotFoundException("Zaduženje sa ID-om " + idZaduzenja + " nije pronađeno."));

        ResursEntity resurs = postojeci.getResurs();

        BigDecimal staroNeto = postojeci.getZaduzenaKolicina().subtract(
                postojeci.getRazduzenaKolicina() != null ? postojeci.getRazduzenaKolicina() : BigDecimal.ZERO
        );

        BigDecimal novoZaduzeno = dto.getZaduzenaKolicina() != null ? dto.getZaduzenaKolicina() : postojeci.getZaduzenaKolicina();
        BigDecimal novoRazduzeno = dto.getRazduzenaKolicina() != null ? dto.getRazduzenaKolicina() : BigDecimal.ZERO;
        BigDecimal novoNeto = novoZaduzeno.subtract(novoRazduzeno);

        BigDecimal korekcijaMagacina = novoNeto.subtract(staroNeto);

        if (resurs.getStanjeMagacina().compareTo(korekcijaMagacina) < 0) {
            throw new RuntimeException("Greška pri ažuriranju: Nedovoljno resursa na stanju za traženu promjenu.");
        }

        resurs.setStanjeMagacina(resurs.getStanjeMagacina().subtract(korekcijaMagacina));
        resursRepository.save(resurs);

        postojeci.setZaduzenaKolicina(novoZaduzeno);
        postojeci.setRazduzenaKolicina(novoRazduzeno);
        postojeci.setDatumZaduzenja(dto.getDatumZaduzenja());
        postojeci.setDatumRazduzenja(dto.getDatumRazduzenja());

        ZaduzenjeEntity sacuvan = zaduzenjeRepository.save(postojeci);
        return convertToDto(sacuvan);
    }

    public void obrisiZaduzenje(Integer idZaduzenja) {
        ZaduzenjeEntity entity = zaduzenjeRepository.findById(idZaduzenja)
                .orElseThrow(() -> new RuntimeException("Zaduženje ne postoji."));

        ResursEntity resurs = entity.getResurs();

        BigDecimal trenutnoZaduzenoNeto = entity.getZaduzenaKolicina().subtract(
                entity.getRazduzenaKolicina() != null ? entity.getRazduzenaKolicina() : BigDecimal.ZERO
        );

        resurs.setStanjeMagacina(resurs.getStanjeMagacina().add(trenutnoZaduzenoNeto));
        resursRepository.save(resurs);

        zaduzenjeRepository.delete(entity);
    }
}
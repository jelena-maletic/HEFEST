package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.*;
import org.etfbl.backend.model.DnevniIzvjestajEntity;
import org.etfbl.backend.model.UtroseniMaterijalEntity;
import org.etfbl.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Transactional
@Service
public class DnevniIzvjestajService {
        private final ModelMapper modelMapper;
        private final DnevniIzvjestajRepository dnevniIzvjestajRepository;
        private final PoslovodjaUpravljaProjektomRepository poslovodjaUpravljaProjektomRepository;
        private final TehnicarRepository tehnicarRepository;
        private final UtroseniMaterijalRepository utroseniMaterijalRepository;
    private final MaterijalRepository materijalRepository;

    public DnevniIzvjestajService(ModelMapper modelMapper, DnevniIzvjestajRepository dnevniIzvjestajRepository, PoslovodjaUpravljaProjektomRepository poslovodjaUpravljaProjektomRepository, TehnicarRepository tehnicarRepository, UtroseniMaterijalRepository utroseniMaterijalRepository, MaterijalRepository materijalRepository) {
            this.modelMapper = modelMapper;
            this.dnevniIzvjestajRepository = dnevniIzvjestajRepository;
            this.poslovodjaUpravljaProjektomRepository = poslovodjaUpravljaProjektomRepository;
            this.tehnicarRepository = tehnicarRepository;
        this.utroseniMaterijalRepository = utroseniMaterijalRepository;
        this.materijalRepository = materijalRepository;
    }

    public List<DnevniIzvjestaj> getAll() {
        return dnevniIzvjestajRepository.findAllByOrderByDatumDesc().stream()
                .map(this::mapToDto)
                .map(this::popuniMaterijale)
                .toList();
    }

    public List<DnevniIzvjestaj> getIzvjestajiZaProjekatUPeriodu(Integer idProjekta, LocalDate od, LocalDate doDatuma) {
        return dnevniIzvjestajRepository
                .findAllByPoslovodjaUpravljaProjektom_Projekat_IdProjektaAndDatumBetween(idProjekta, od, doDatuma)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public DnevniIzvjestaj getById(Integer id) {
        return dnevniIzvjestajRepository.findById(id)
                .map(this::mapToDto)
                .map(this::popuniMaterijale)
                .orElseThrow(() -> new RuntimeException("Dnevni izvještaj nije pronađen: " + id));
    }

    public DnevniIzvjestaj create(DnevniIzvjestaj dto) {
        DnevniIzvjestajEntity entity = new DnevniIzvjestajEntity();

        updateEntityFromDto(entity, dto);
        entity.setDatumKreiranja(LocalDate.now());
        entity.setIzvjestaj(entity);

        var tehnicar = tehnicarRepository.findById(dto.getJmbTehnicar())
                .orElseThrow(() -> new RuntimeException("Tehničar nije pronađen!"));
        entity.setTehnicar(tehnicar);

        var pup = poslovodjaUpravljaProjektomRepository.findFirstByProjekat_IdProjektaOrderByIdDesc(dto.getIdProjekta())
                .orElseThrow(() -> new RuntimeException("Nije pronađen aktivna veza poslovođa-projekat za ID: " + dto.getIdProjekta()));

        entity.setPoslovodjaUpravljaProjektom(pup);

        return mapToDto(dnevniIzvjestajRepository.save(entity));
    }

    public DnevniIzvjestaj update(Integer id, DnevniIzvjestaj dto) {
        DnevniIzvjestajEntity entity = dnevniIzvjestajRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Izvještaj nije pronađen"));

        updateEntityFromDto(entity, dto);

        if (dto.getJmbTehnicar() != null) {
            var tehnicar = tehnicarRepository.findById(dto.getJmbTehnicar())
                    .orElseThrow(() -> new RuntimeException("Tehničar nije pronađen"));
            entity.setTehnicar(tehnicar);
        }

        return mapToDto(dnevniIzvjestajRepository.save(entity));
    }

    public void delete(Integer id) {
        dnevniIzvjestajRepository.deleteById(id);
    }

    private void updateEntityFromDto(DnevniIzvjestajEntity entity, DnevniIzvjestaj dto) {
        entity.setDatum(dto.getDatum());
        entity.setSatiRada(dto.getSatiRada());
        entity.setNocniSati(dto.getNocniSati());
        entity.setPrekovremeniSati(dto.getPrekovremeniSati());
        entity.setTerenskiSati(dto.getTerenskiSati());
        //entity.setUkupniSati(dto.getUkupniSati());
        entity.setOpisRadova(dto.getOpisRadova());
        BigDecimal ukupno = BigDecimal.ZERO;

        if (dto.getSatiRada() != null) ukupno = ukupno.add(dto.getSatiRada());
        if (dto.getNocniSati() != null) ukupno = ukupno.add(dto.getNocniSati());
        if (dto.getPrekovremeniSati() != null) ukupno = ukupno.add(dto.getPrekovremeniSati());
        if (dto.getTerenskiSati() != null) ukupno = ukupno.add(dto.getTerenskiSati());

        entity.setUkupniSati(ukupno);
    }

    private DnevniIzvjestaj mapToDto(DnevniIzvjestajEntity entity) {
        DnevniIzvjestaj dto = new DnevniIzvjestaj();

        dto.setIdIzvjestaja(entity.getId());
        dto.setDatumKreiranja(entity.getDatumKreiranja());
        dto.setDatum(entity.getDatum());
        dto.setSatiRada(entity.getSatiRada());
        dto.setNocniSati(entity.getNocniSati());
        dto.setPrekovremeniSati(entity.getPrekovremeniSati());
        dto.setTerenskiSati(entity.getTerenskiSati());
        dto.setUkupniSati(entity.getUkupniSati());
        dto.setOpisRadova(entity.getOpisRadova());

        if (entity.getPoslovodjaUpravljaProjektom() != null) {
            var pup = entity.getPoslovodjaUpravljaProjektom();

            if (pup.getProjekat() != null) {
                dto.setIdProjekta(pup.getProjekat().getIdProjekta());

                org.etfbl.backend.dto.Projekat pDto = new org.etfbl.backend.dto.Projekat();
                pDto.setId(pup.getProjekat().getIdProjekta());
                pDto.setNaziv(pup.getProjekat().getNaziv());
                dto.setProjekat(pDto);
            }

            if (pup.getPoslovodja() != null) {
                dto.setJmbPoslovodja(pup.getPoslovodja().getJmb());

                org.etfbl.backend.dto.Poslovodja rDto = new org.etfbl.backend.dto.Poslovodja();
                rDto.setJmb(pup.getPoslovodja().getJmb());
                rDto.setIme(pup.getPoslovodja().getIme());
                rDto.setPrezime(pup.getPoslovodja().getPrezime());
                dto.setPoslovodja(rDto);
            }
        }


        if (entity.getTehnicar() != null) {

            dto.setJmbTehnicar(entity.getTehnicar().getJmb());

            org.etfbl.backend.dto.Tehnicar tDto = new org.etfbl.backend.dto.Tehnicar();
            tDto.setJmb(entity.getTehnicar().getJmb());
            tDto.setIme(entity.getTehnicar().getIme());
            tDto.setPrezime(entity.getTehnicar().getPrezime());

            dto.setTehnicar(tDto);
        }

        return dto;
    }
    private DnevniIzvjestaj popuniMaterijale(DnevniIzvjestaj dto) {
        if (dto != null && dto.getIdIzvjestaja() != null) {
            List<UtroseniMaterijal> materijali = utroseniMaterijalRepository.nadjiSveZaIzvjestaj(dto.getIdIzvjestaja())
                    .stream()
                    .map(m -> {
                        UtroseniMaterijal mDto = modelMapper.map(m, UtroseniMaterijal.class);
                        // Eksplicitno mapiranje ugniježđenog materijala ako modelMapper zakaže
                        if (m.getMaterijal() != null) {
                            mDto.setMaterijal(modelMapper.map(m.getMaterijal(), Materijal.class));
                        }
                        return mDto;
                    })
                    .toList();
            dto.setUtroseniMaterijali(materijali);
        }
        return dto;
    }


}

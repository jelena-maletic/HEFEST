package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.*;
import org.etfbl.backend.model.DnevniIzvjestajEntity;
import org.etfbl.backend.repository.DnevniIzvjestajRepository;
import org.etfbl.backend.repository.PoslovodjaUpravljaProjektomRepository;
import org.etfbl.backend.repository.SumarniIzvjestajRepository;
import org.etfbl.backend.repository.TehnicarRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Transactional
@Service
public class DnevniIzvjestajService {
        private final ModelMapper modelMapper;
        private final DnevniIzvjestajRepository dnevniIzvjestajRepository;
        private final PoslovodjaUpravljaProjektomRepository poslovodjaUpravljaProjektomRepository;
        private final TehnicarRepository tehnicarRepository;

        public DnevniIzvjestajService(ModelMapper modelMapper, DnevniIzvjestajRepository dnevniIzvjestajRepository, PoslovodjaUpravljaProjektomRepository poslovodjaUpravljaProjektomRepository, TehnicarRepository tehnicarRepository) {
            this.modelMapper = modelMapper;
            this.dnevniIzvjestajRepository = dnevniIzvjestajRepository;
            this.poslovodjaUpravljaProjektomRepository = poslovodjaUpravljaProjektomRepository;
            this.tehnicarRepository = tehnicarRepository;
        }

    public List<DnevniIzvjestaj> getAll() {
        return dnevniIzvjestajRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public DnevniIzvjestaj getById(Integer id) {
        DnevniIzvjestajEntity entity = dnevniIzvjestajRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dnevni izvještaj nije pronađen: " + id));
        return mapToDto(entity);
    }

    public DnevniIzvjestaj create(DnevniIzvjestaj dto) {
        DnevniIzvjestajEntity entity = new DnevniIzvjestajEntity();

        updateEntityFromDto(entity, dto);
        entity.setDatumKreiranja(LocalDate.now());
        entity.setIzvjestaj(entity);

        var tehnicar = tehnicarRepository.findById(dto.getJmbTehnicar())
                .orElseThrow(() -> new RuntimeException("Tehničar nije pronađen!"));
        entity.setTehnicar(tehnicar);

        var pup = poslovodjaUpravljaProjektomRepository.findByProjekat_IdProjekta(dto.getIdProjekta())
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Nije pronađen poslovođa za projekat ID: " + dto.getIdProjekta()));

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
        entity.setUkupniSati(dto.getUkupniSati());
        entity.setOpisRadova(dto.getOpisRadova());
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


}

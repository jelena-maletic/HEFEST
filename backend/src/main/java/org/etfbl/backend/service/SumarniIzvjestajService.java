package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.Poslovodja;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.SumarniIzvjestaj;
import org.etfbl.backend.model.DnevniIzvjestajEntity;
import org.etfbl.backend.model.SumarniIzvjestajEntity;
import org.etfbl.backend.repository.DnevniIzvjestajRepository;
import org.etfbl.backend.repository.PoslovodjaUpravljaProjektomRepository;
import org.etfbl.backend.repository.SumarniIzvjestajRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Transactional
@Service
public class SumarniIzvjestajService {
    private final ModelMapper modelMapper;
    private final SumarniIzvjestajRepository sumarniIzvjestajRepository;
    private final PoslovodjaUpravljaProjektomRepository pupRepository;
    private final DnevniIzvjestajRepository dnevniIzvjestajRepository;

    public SumarniIzvjestajService(ModelMapper modelMapper, SumarniIzvjestajRepository sumarniIzvjestajRepository, PoslovodjaUpravljaProjektomRepository pupRepository, DnevniIzvjestajRepository dnevniIzvjestajRepository) {
        this.modelMapper = modelMapper;
        this.sumarniIzvjestajRepository = sumarniIzvjestajRepository;
        this.pupRepository = pupRepository;
        this.dnevniIzvjestajRepository = dnevniIzvjestajRepository;
    }
    public List<SumarniIzvjestaj> getAll() {
        return sumarniIzvjestajRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public SumarniIzvjestaj getById(Integer id) {
        SumarniIzvjestajEntity entity = sumarniIzvjestajRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sumarni izvještaj nije pronađen: " + id));
        return mapToDto(entity);
    }

    public SumarniIzvjestaj create(SumarniIzvjestaj dto) {
        SumarniIzvjestajEntity entity = new SumarniIzvjestajEntity();

        entity.setIzvjestaj(entity);

        updateEntityFromDto(entity, dto);
        entity.setDatumKreiranja(LocalDate.now());

        var pup = pupRepository.findFirstByProjekat_IdProjektaAndPoslovodja_JmbOrderByIdDesc(
                        dto.getIdProjekta(), dto.getJmbPoslovodja())
                .orElseThrow(() -> new RuntimeException("Veza poslovođa-projekat ne postoji!"));

        entity.setPoslovodjaUpravljaProjektom(pup);

        if (dto.getStavkeIds() != null && !dto.getStavkeIds().isEmpty()) {
            List<DnevniIzvjestajEntity> dnevnici = dnevniIzvjestajRepository.findAllById(dto.getStavkeIds());
            entity.setDnevniIzvjestaji(dnevnici);
        }

        return mapToDto(sumarniIzvjestajRepository.save(entity));
    }

    public SumarniIzvjestaj update(Integer id, SumarniIzvjestaj dto) {
        SumarniIzvjestajEntity entity = sumarniIzvjestajRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sumarni izvještaj nije pronađen"));

        updateEntityFromDto(entity, dto);

        if (dto.getIdProjekta() != null && dto.getJmbPoslovodja() != null) {
            var pup = pupRepository.findFirstByProjekat_IdProjektaAndPoslovodja_JmbOrderByIdDesc(
                            dto.getIdProjekta(), dto.getJmbPoslovodja())
                    .orElseThrow(() -> new RuntimeException("Veza poslovođa-projekat ne postoji!"));
            entity.setPoslovodjaUpravljaProjektom(pup);
        }

        return mapToDto(sumarniIzvjestajRepository.save(entity));
    }

    public void delete(Integer id) {
        sumarniIzvjestajRepository.deleteById(id);
    }

    private void updateEntityFromDto(SumarniIzvjestajEntity entity, SumarniIzvjestaj dto) {
        entity.setPocetniDatum(dto.getPocetniDatum());
        entity.setKrajnjiDatum(dto.getKrajnjiDatum());
        entity.setUkupniSatiRada(dto.getUkupniSatiRada());
        entity.setOpis(dto.getOpis());
    }

    private SumarniIzvjestaj mapToDto(SumarniIzvjestajEntity entity) {
        SumarniIzvjestaj dto = new SumarniIzvjestaj();
        dto.setIdIzvjestaja(entity.getId());
        dto.setDatumKreiranja(entity.getDatumKreiranja());
        dto.setPocetniDatum(entity.getPocetniDatum());
        dto.setKrajnjiDatum(entity.getKrajnjiDatum());
        dto.setUkupniSatiRada(entity.getUkupniSatiRada());
        dto.setOpis(entity.getOpis());

        if (entity.getPoslovodjaUpravljaProjektom() != null) {
            var pup = entity.getPoslovodjaUpravljaProjektom();

            dto.setIdProjekta(pup.getProjekat().getIdProjekta());
            dto.setJmbPoslovodja(pup.getPoslovodja().getJmb());

            if (pup.getProjekat() != null) {
                Projekat pDto = new Projekat();
                pDto.setId(pup.getProjekat().getIdProjekta());
                pDto.setNaziv(pup.getProjekat().getNaziv());
                dto.setProjekat(pDto);
            }
            if (pup.getPoslovodja() != null) {
                Poslovodja rDto = new Poslovodja();
                rDto.setIme(pup.getPoslovodja().getIme());
                rDto.setPrezime(pup.getPoslovodja().getPrezime());
                dto.setPoslovodja(rDto);
            }
        }
        return dto;
    }
}

package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Materijal;
import org.etfbl.backend.dto.Poslovodja;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.SumarniIzvjestaj;
import org.etfbl.backend.repository.SumarniIzvjestajRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class SumarniIzvjestajService {
    private final ModelMapper modelMapper;
    private final SumarniIzvjestajRepository sumarniIzvjestajRepository;

    public SumarniIzvjestajService(ModelMapper modelMapper, SumarniIzvjestajRepository sumarniIzvjestajRepository) {
        this.modelMapper = modelMapper;
        this.sumarniIzvjestajRepository = sumarniIzvjestajRepository;
    }

    public List<SumarniIzvjestaj> getAll() {
        return sumarniIzvjestajRepository.findAll().stream().map(entity -> {
            SumarniIzvjestaj dto = new SumarniIzvjestaj();

            dto.setIdIzvjestaja(entity.getId());
            dto.setDatumKreiranja(entity.getDatumKreiranja());

            if (entity.getPoslovodjaUpravljaProjektom() != null) {

                var pup = entity.getPoslovodjaUpravljaProjektom();

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

            dto.setPocetniDatum(entity.getPocetniDatum());
            dto.setKrajnjiDatum(entity.getKrajnjiDatum());
            dto.setUkupniSatiRada(entity.getUkupniSatiRada());
            dto.setOpis(entity.getOpis());

            return dto;
        }).toList();
    }
}

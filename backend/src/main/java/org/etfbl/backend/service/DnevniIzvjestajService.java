package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.dto.Poslovodja;
import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.SumarniIzvjestaj;
import org.etfbl.backend.repository.DnevniIzvjestajRepository;
import org.etfbl.backend.repository.SumarniIzvjestajRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class DnevniIzvjestajService {
        private final ModelMapper modelMapper;
        private final DnevniIzvjestajRepository dnevniIzvjestajRepository;

        public DnevniIzvjestajService(ModelMapper modelMapper, DnevniIzvjestajRepository dnevniIzvjestajRepository) {
            this.modelMapper = modelMapper;
            this.dnevniIzvjestajRepository = dnevniIzvjestajRepository;
        }

        public List<DnevniIzvjestaj> getAll() {
            return dnevniIzvjestajRepository.findAll().stream().map(entity -> {
                DnevniIzvjestaj dto = new DnevniIzvjestaj();

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

                dto.setDatum(entity.getDatum());
                dto.setSatiRada(entity.getSatiRada());
                dto.setNocniSati(entity.getNocniSati());
                dto.setPrekovremeniSati(entity.getPrekovremeniSati());
                dto.setTerenskiSati(entity.getTerenskiSati());
                dto.setUkupniSati(entity.getUkupniSati());
                dto.setOpisRadova(entity.getOpisRadova());

                return dto;
            }).toList();
        }
}

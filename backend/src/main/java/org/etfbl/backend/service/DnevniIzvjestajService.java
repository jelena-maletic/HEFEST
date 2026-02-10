package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.DnevniIzvjestaj;
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

            // 1. Polja iz roditeljske klase (IzvjestajEntity)
            dto.setIdIzvjestaja(entity.getId());
            dto.setDatumKreiranja(entity.getDatumKreiranja());

            // 2. Podaci o projektu i poslovođi (iz asocijacije u roditelju)
            if (entity.getPoslovodjaUpravljaProjektom() != null) {
                dto.setIdProjekta(entity.getPoslovodjaUpravljaProjektom().getIdProjekta());
                dto.setJmbPoslovodja(entity.getPoslovodjaUpravljaProjektom().getPoslovodjaJMB());
            }

            // 3. Podaci iz DnevniIzvjestajEntity
            dto.setDatum(entity.getDatum());
            dto.setSatiRada(entity.getSatiRada());
            dto.setNocniSati(entity.getNocniSati());
            dto.setPrekovremeniSati(entity.getPrekovremeniSati());
            dto.setTerenskiSati(entity.getTerenskiSati());
            dto.setUkupniSati(entity.getUkupniSati());
            dto.setOpisRadova(entity.getOpisRadova());

            // 4. JMB Tehničara (izvlačimo iz TehnicarEntity veze)
            //if (entity.getTehnicar() != null) {
            //    dto.setJmbTehnicar(entity.getTehnicar().getJmb());
            //}

            return dto;
        }).toList();
    }
}

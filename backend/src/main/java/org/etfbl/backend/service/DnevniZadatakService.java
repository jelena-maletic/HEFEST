package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.DnevniIzvjestaj;
import org.etfbl.backend.dto.DnevniZadatak;
import org.etfbl.backend.dto.Poslovodja;
import org.etfbl.backend.dto.Tehnicar;
import org.etfbl.backend.repository.DnevniZadatakRepository;
import org.etfbl.backend.repository.UtroseniMaterijalRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class DnevniZadatakService {
    private final DnevniZadatakRepository dnevniZadatakRepository;
    private final ModelMapper modelMapper;

    public DnevniZadatakService(DnevniZadatakRepository dnevniZadatakRepository, ModelMapper modelMapper) {
        this.dnevniZadatakRepository = dnevniZadatakRepository;
        this.modelMapper = modelMapper;
    }


    public List<DnevniZadatak> getAll() {
        return dnevniZadatakRepository.findAll().stream().map(entity -> {

            DnevniZadatak dto = modelMapper.map(entity, DnevniZadatak.class);

            if (entity.getDnevniIzvjestaj() != null) {
                dto.setDnevniIzvjestaj(modelMapper.map(entity.getDnevniIzvjestaj(), DnevniIzvjestaj.class));
            }

            if (entity.getPoslovodja() != null) {
                dto.setPoslovodja(modelMapper.map(entity.getPoslovodja(), Poslovodja.class));
            }

            if (entity.getTehnicar() != null) {
                dto.setTehnicar(modelMapper.map(entity.getTehnicar(), Tehnicar.class));
            }

            return dto;
        }).toList();
    }
}

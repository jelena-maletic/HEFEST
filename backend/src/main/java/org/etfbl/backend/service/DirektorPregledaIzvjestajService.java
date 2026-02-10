package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.DirektorPregledaIzvjestaj;
import org.etfbl.backend.model.DirektorPregledaIzvjestajEntity;
import org.etfbl.backend.repository.DirektorPregledaIzvjestajRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class DirektorPregledaIzvjestajService {
    private final DirektorPregledaIzvjestajRepository repository;
    private final ModelMapper modelMapper;

    public DirektorPregledaIzvjestajService(DirektorPregledaIzvjestajRepository repository, ModelMapper modelMapper) {
        this.repository = repository;
        this.modelMapper = modelMapper;
    }

    public List<DirektorPregledaIzvjestaj> getAllDirektorPregledaIzvjestaj() {
        List<DirektorPregledaIzvjestajEntity> entities = repository.findAll();

        return entities.stream()
                .map(entity -> {
                    DirektorPregledaIzvjestaj dto = new DirektorPregledaIzvjestaj();
                    dto.setIdIzvjestaja(entity.getIdIzvjestaja());
                    dto.setDirektorJMB(entity.getDirektorJMB());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}

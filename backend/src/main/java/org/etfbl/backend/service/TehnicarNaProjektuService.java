package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.TehnicarNaProjektu;
import org.etfbl.backend.model.TehnicarNaProjektuEntity;
import org.etfbl.backend.repository.TehnicarNaProjektuRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class TehnicarNaProjektuService {

    private final TehnicarNaProjektuRepository repository;
    private final ModelMapper modelMapper;

    public TehnicarNaProjektuService(TehnicarNaProjektuRepository repository, ModelMapper modelMapper) {
        this.repository = repository;
        this.modelMapper = modelMapper;
    }

    public List<TehnicarNaProjektu> getAllTehnicarNaProjektu() {
        List<TehnicarNaProjektuEntity> entities = repository.findAll();

        return entities.stream()
                .map(entity -> {
                    TehnicarNaProjektu dto = new TehnicarNaProjektu();
                    dto.setIdProjekta(entity.getIdProjekta());
                    dto.setTehnicarJMB(entity.getTehnicarJMB());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}


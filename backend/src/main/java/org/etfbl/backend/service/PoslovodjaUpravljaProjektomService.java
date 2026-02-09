package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.PoslovodjaUpravljaProjektom; // Tvoj DTO
import org.etfbl.backend.model.PoslovodjaUpravljaProjektomEntity;
import org.etfbl.backend.repository.PoslovodjaUpravljaProjektomRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class PoslovodjaUpravljaProjektomService {

    private final PoslovodjaUpravljaProjektomRepository repository;
    private final ModelMapper modelMapper;

    public PoslovodjaUpravljaProjektomService(PoslovodjaUpravljaProjektomRepository repository, ModelMapper modelMapper) {
        this.repository = repository;
        this.modelMapper = modelMapper;
    }

    public List<PoslovodjaUpravljaProjektom> getAllPoslovodjaUpravljaProjektom() {
        List<PoslovodjaUpravljaProjektomEntity> entities = repository.findAll();

        return entities.stream()
                .map(entity -> {
                    PoslovodjaUpravljaProjektom dto = new PoslovodjaUpravljaProjektom();
                    dto.setIdProjekta(entity.getIdProjekta());
                    dto.setPoslovodjaJMB(entity.getPoslovodjaJMB());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
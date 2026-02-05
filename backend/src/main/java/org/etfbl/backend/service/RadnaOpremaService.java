package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.RadnaOprema;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.RadnaOpremaEntity;
import org.etfbl.backend.repository.RadnaOpremaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
@Transactional
@Service
public class RadnaOpremaService {
    private final ModelMapper modelMapper;
    private final RadnaOpremaRepository radnaOpremaRepository;

    public RadnaOpremaService(ModelMapper modelMapper, RadnaOpremaRepository radnaOpremaRepository) {
        this.modelMapper = modelMapper;
        this.radnaOpremaRepository = radnaOpremaRepository;
    }

    public List<RadnaOprema> getAll() {
        return radnaOpremaRepository.findAll().stream().map(ro -> modelMapper.map(ro, RadnaOprema.class )).toList();

    }
}

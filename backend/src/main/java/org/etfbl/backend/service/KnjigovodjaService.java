package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Knjigovodja;
import org.etfbl.backend.repository.KnjigovodjaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class KnjigovodjaService {
    private final KnjigovodjaRepository knjigovodjaRepository;
    private final ModelMapper modelMapper;

    public KnjigovodjaService(KnjigovodjaRepository knjigovodjaRepository, ModelMapper modelMapper) {
        this.knjigovodjaRepository = knjigovodjaRepository;
        this.modelMapper = modelMapper;
    }

    public List<Knjigovodja> getAll() { return knjigovodjaRepository.findAll().stream().map(k -> modelMapper.map(k, Knjigovodja.class )).toList();}

}

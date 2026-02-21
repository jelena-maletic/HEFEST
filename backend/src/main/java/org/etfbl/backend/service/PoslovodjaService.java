package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Poslovodja;
import org.etfbl.backend.repository.PoslovodjaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class PoslovodjaService {
    private final PoslovodjaRepository poslovodjaRepository;
    private final ModelMapper modelMapper;

    public PoslovodjaService(PoslovodjaRepository poslovodjaRepository, ModelMapper modelMapper) {
        this.poslovodjaRepository = poslovodjaRepository;
        this.modelMapper = modelMapper;
    }

    public List<Poslovodja> getAll() { return poslovodjaRepository.findAll().stream().map(p -> modelMapper.map(p, Poslovodja.class )).toList();}
}


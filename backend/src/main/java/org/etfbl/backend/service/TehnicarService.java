package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Tehnicar;
import org.etfbl.backend.repository.TehnicarRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class TehnicarService {
    private final TehnicarRepository tehnicarRepository;
    private final ModelMapper modelMapper;

    public TehnicarService(TehnicarRepository tehnicarRepository, ModelMapper modelMapper) {
        this.tehnicarRepository = tehnicarRepository;
        this.modelMapper = modelMapper;
    }

    public List<Tehnicar> getAll() { return tehnicarRepository.findAll().stream().map(t -> modelMapper.map(t, Tehnicar.class )).toList();}
}


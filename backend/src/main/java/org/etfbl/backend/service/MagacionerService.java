package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Magacioner;
import org.etfbl.backend.repository.MagacionerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class MagacionerService {
    private final MagacionerRepository magacionerRepository;
    private final ModelMapper modelMapper;

    public MagacionerService(MagacionerRepository magacionerRepository, ModelMapper modelMapper) {
        this.magacionerRepository = magacionerRepository;
        this.modelMapper = modelMapper;
    }

    public List<Magacioner> getAll() { return magacionerRepository.findAll().stream().map(m -> modelMapper.map(m, Magacioner.class )).toList();}
}


package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.repository.DirektorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class DirektorService {
    private final DirektorRepository direktorRepository;
    private final ModelMapper modelMapper;

    public DirektorService(DirektorRepository direktorRepository, ModelMapper modelMapper) {
        this.direktorRepository = direktorRepository;
        this.modelMapper = modelMapper;
    }

    public List<Direktor> getAll() { return direktorRepository.findAll().stream().map(d -> modelMapper.map(d, Direktor.class )).toList();}
}

package org.etfbl.backend.service;

import jakarta.transaction.Transactional;
import org.etfbl.backend.dto.Direktor;
import org.etfbl.backend.dto.Zaposleni;
import org.etfbl.backend.repository.ZaposleniRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class ZaposleniService {
    private final ZaposleniRepository zaposleniRepository;
    private final ModelMapper modelMapper;

    public ZaposleniService(ZaposleniRepository zaposleniRepository, ModelMapper modelMapper) {
        this.zaposleniRepository = zaposleniRepository;
        this.modelMapper = modelMapper;
    }

    public List<Zaposleni> getAll() { return zaposleniRepository.findAll().stream().map(z -> modelMapper.map(z, Zaposleni.class )).toList();}
}


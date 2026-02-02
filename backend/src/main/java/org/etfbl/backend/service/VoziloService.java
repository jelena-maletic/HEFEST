package org.etfbl.backend.service;


import org.etfbl.backend.dto.Projekat;
import org.etfbl.backend.dto.Vozilo;
import org.etfbl.backend.model.MagacionerUpravljaResursomEntity;
import org.etfbl.backend.model.VoziloEntity;
import org.etfbl.backend.repository.VoziloRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoziloService {
    private final VoziloRepository voziloRepository;
    private final ModelMapper modelMapper;

    public VoziloService(VoziloRepository voziloRepository, ModelMapper modelMapper) {
        this.voziloRepository = voziloRepository;
        this.modelMapper = modelMapper;
    }

    public List<Vozilo> getAllVozilo() {

        return voziloRepository.findAll().stream().map(vozilo -> modelMapper.map(vozilo, Vozilo.class )).toList();

    }



}
